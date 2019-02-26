/* eslint no-use-before-define: off */

const config = require('config');
const logger = require('../../logger.js');
const server = require('../../server/server.js');

const TAG = 'Mention Antispam';

const list = {}; // Object to store mention counts for members, indexed by user ID

module.exports = {
    // Check members aren't trying to sneak mentions in by editing messages
    edits(oldMessage, newMessage) {
        // Check mentions (discord.js's message.mentions won't work here)
        if ((newMessage.content.match(/<@/g) || []).length > 0) {
            // Collect mentions in old message
            let mentionCount = (oldMessage.content.match(/<@/g) || []).length;
            const msg1 = [oldMessage.content];
            for (let x = 0; x < mentionCount; x++) {
                const confirmed = confirmMention(msg1[0], msg1[0].indexOf('<@'));
                if (confirmed) {
                    msg1.push(confirmed);
                }
                msg1[0] = msg1[0].substring(msg1[0].indexOf('<@') + 2);
            }

            // Collect mentions in new message
            mentionCount = (newMessage.content.match(/<@/g) || []).length;
            const msg2 = [newMessage.content];
            for (let x = 0; x < mentionCount; x++) {
                const confirmed = confirmMention(msg2[0], msg2[0].indexOf('<@'));
                if (confirmed) {
                    msg2.push(confirmed);
                }
                msg2[0] = msg2[0].substring(msg2[0].indexOf('<@') + 2);
            }

            // Compare mentions and count discrepancies
            mentionCount = msg2.length - 1;
            for (let i = 1; i < msg2.length; i++) {
                for (const x in msg1) {
                    if (msg1[x] === msg2[i]) {
                        mentionCount--;
                        break;
                    }
                }
            }

            // Log discrepancies if there are any
            if (mentionCount > 0) {
                logger.info(TAG, `${newMessage.member.displayName} edited in mentions to their message`);
                if (!list[newMessage.author.id]) {
                    trackUser(newMessage.author.id);
                }
                list[newMessage.author.id].memberMentions += mentionCount;
                list[newMessage.author.id].check = true;
                list[newMessage.author.id].memberAction = true;
                checkUser(newMessage);
            }
        }
    },

    // Check server messages for mentions if mention checks are enabled
    execute(message) {
        if (config.get('features.disableMentionSpam')) { return; } // Feature switch
        if (message.guild.id !== server.getGuild().id) { return; }
        if (this.exemptMember(message.member)) { return; }
        countMentions(message);
        if (checkUser(message)) {
            list[message.author.id].check = false;
            return;
        }
        checkStaff(message);
        if (list[message.author.id]) {
            list[message.author.id].check = false;
        }
    },

    /**
     * @param member
     * @return {boolean}
     */
    exemptMember(member) {
        if (member.roles.has(config.get('general.staffRoleID'))) { return true; }
        for (const role of config.get('general.leaderRoles')) {
            if (member.roles.has(role)) { return true; }
        }
        return false;
    },

    // Check members joining the server are not attempting to evade a supermute
    joinCheck(member) {
        if (!list[member.user.id]) { return; } // Member not tracked
        // If muted is not false, member has attempted to evade a supermute
        if (list[member.user.id].muted) {
            logger.info(TAG, `Supermute evasion attempt caught for ${member.displayName}`);
            member.addRole(server.getRole(config.get('general.superMuteRoleID')))
                .then(
                    logger.debug(TAG, 'Succesfully added mute role'),
                )
                .catch(err => logger.warning(TAG, `Failed to add mute role to member, error: ${err}`));
            server.getChannel('staff').sendMessage(`${member.displayName} attempted to `
                + 'evade supermute by rejoining the server to reset their roles. But I\'m smarter than that.')
                .then(() => logger.info(TAG, 'informed staff of mute evasion attempt'))
                .catch(err => logger.warning(TAG, err));
            member.sendMessage('Attempting to evade a supermute is a serious offence, if you continue '
                + 'to defy server rules you may be banned from the server')
                .then(() => logger.debug(TAG, 'Succesfully sent message'))
                .catch(err => logger.warning(TAG, `Failed to send message, error: ${err}`));
        }
    },

    // Check if a supermute has been overwritten, if so reset that member's mention allowance
    memberUpdate(oldMember, newMember) {
        if (!list[newMember.user.id]) { return; } // Check user is tracked
        if (!list[newMember.user.id].muted) { return; } // If user isn't muted no need to check
        if (!oldMember.roles.has(config.get('general.superMuteRoleID'))) { return; }
        if (newMember.roles.has(config.get('general.superMuteRoleID'))) { return; }
        // Override point
        // Inform staff that override was succesfull
        server.getChannel('staff').sendMessage(`Staff member override confirmed for ${newMember.displayName}, `
            + 'mentions allowance reset')
            .then(() => logger.info(TAG, 'Informed staff of mute override'))
            .catch(err => logger.warning(TAG, `Failed to send message to staff, error: ${err}`));
        // Inform member the mute has been overwritten
        newMember.sendMessage(`${newMember.displayName} your mute has been overwritten `
            + 'by a staff member so you\'re free to talk again. Your mention allowance has also been '
            + 'reset, please be more careful next time.')
            .then(() => logger.info(TAG, 'Informed member of mute override'))
            .catch(err => logger.warning(TAG, `Failed to send message to member, error: ${err}`));
        // Reset allowance
        trackUser(newMember.user.id);
    },

    // Pass an up to date version of the mention spammers list
    passList() {
        return list;
    },

    // Called every 5 mins by admin.js
    release() {
        if (config.get('features.disableMentionSpam')) { return; } // Feature switch
        // If there are unlisted muted members (most likely due to bot restart) then unmute them
        const muteRole = server.getRole(config.get('general.superMuteRoleID'));
        let roleList = [];

        if (muteRole !== null) {
            roleList = muteRole.members.array();
        }

        /* If supermuted user isn't on record (most likely either someone wrongfully gave them the
        role or the bot restarted) */
        if (roleList.length === 0) {
            logger.info(TAG, 'No roles were found in muteRole.members');
            return;
        }
        for (const x in roleList) {
            if (!list[roleList[x].user.id]) {
                roleList[x].removeRole(server.getRole(config.get('general.superMuteRoleID')))
                    .then(() => logger.debug(TAG, 'Succesfully removed mute role from '
                        + `${roleList[x].displayName}`))
                    .catch(err => logger.warning(TAG, `Failed to remove members role, error: ${err}`));
                roleList[x].sendMessage('Your mute on the DIG server has expired, please '
                    + 'respect the server rules in the future')
                    .then(() => logger.debug(TAG, 'Succesfully sent message to member informing of mute removal'))
                    .catch(err => logger.warning(TAG, `Failed to send message to member, error: ${err}`));
                logger.warning(TAG, `Removed ${roleList[x].displayName} from mute role `
                    + '(member not found in list)');
            }
        }

        // Check listed muted members
        const now = new Date();
        for (const x in list) {
            if (!list[x].muted) { continue; } // eslint-disable-line no-continue
            if (now.getTime() - list[x].muted < config.get('mentionsMuteTime')) {
                continue; // eslint-disable-line no-continue
            }
            list[x].muted = false;
            logger.info(TAG, `${list[x].member.displayName}'s mute expired, they have been un-muted`);
            list[x].member.removeRole(muteRole)
                .then(() => logger.debug(TAG, `Succesfully removed mute role from ${list[x].member.displayName}`))
                .catch(err => logger.warning(TAG, `Failed to remove members role, error: ${err}`));
            list[x].member.sendMessage('Your mute on the DIG server has expired, please respect the '
                + 'server rules in the future. Your mention allowance however may not have been reset; '
                + 'mentioning more before your allowance is reset will result in another immidate mute, '
                + 'please use "!mentions" at any time to check your allowance.')
                .then(() => logger.debug(TAG, 'Succesfully sent message to member informing of mute removal'))
                .catch(err => logger.warning(TAG, `Failed to send message to member, error: ${err}`));
        }

        // If time for 4am reset
        if (now.getHours() === 3 || now.getHours() === 4) {
            const m = (now.getHours() * 60) + now.getMinutes();
            if (m >= 240 && m <= 245) {
                logger.debug(TAG, 'Daily mentionSpam reset');
                for (const x in list) {
                    if (!list[x].muted) {
                        delete list[x];
                    } else {
                        list[x].memberMentions = 0;
                        list[x].memberWarnings = 0;
                        list[x].roleMentions = 0;
                        list[x].roleWarnings = 0;
                        continue; // eslint-disable-line no-continue
                    }
                }
                logger.info(TAG, 'Mention limits reset!');
            }
        }
    },
};

// Checks if user is mentioning the community staff, if so remind them the tags not for trolling
function checkStaff(message) {
    if (!list[message.author.id]) { return; } // Check user has mentioned
    if (!list[message.author.id].check) { return; } // See if user needs to be checked
    if (message.mentions.roles.array().length > 0) {
        for (const x in message.mentions.roles) {
            if (
                message.mentions.roles.array()[x] === server.getGuild().roles.get(config.get('general.staffRoleID'))
                || message.mentions.roles.array()[x] === server.getGuild().roles.get(config.get('general.adminsRoleID'))
            ) {
                message.author.sendMessage(`Hey ${message.member.displayName} thanks for `
                    + 'contacting the DIG community staff, someone will get back to you soon™. Please '
                    + 'only mention staff when you need help though. If you\'re trying to troll, mentioning '
                    + 'a load of people with banhammers probably isn\'t the best way to do it.')
                    .then(() => logger.debug(TAG, '"Don\'t spam admins" message succesfully sent'))
                    .catch(err => logger.warning(TAG, `Message failed to send, error: ${err}`));
                break;
            }
        }
    }
}

// Checks if a single user in the listing needs a warning/mute, if so take action
function checkUser(message) {
    if (!list[message.author.id]) { return false; } // Check user has mentioned
    if (!list[message.author.id].check) { return false; } // See if user needs to be checked
    // Check user's member mentions
    if (
        list[message.author.id].memberMentions >= config.get('memberMentionLimit')
        && list[message.author.id].memberAction
    ) {
        list[message.author.id].memberAction = false;
        if (list[message.author.id].memberWarnings === 0) {
            list[message.author.id].memberWarnings++;
            message.channel.sendMessage(`${message.member.displayName} you have hit our daily `
                + 'mention limit for members. You may not mention another member this 24 hour period. '
                + 'Please use "!mentions" to check your allowance before you mention again.')
                .then(() => logger.info(TAG, `${message.member.displayName} hit their member mention limit`))
                .catch(err => logger.warning(TAG, `Message failed to send, error: ${err}`));
            return true;
        }
        if (list[message.author.id].memberWarnings === 1) {
            list[message.author.id].memberWarnings++;
            message.reply('do not mention again. I\'ve sent you a DM that I strongly suggest you read now.')
                .then(() => logger.info(TAG, `${message.member.displayName} exceeded their member `
                    + 'mention limit'))
                .catch(err => logger.warning(TAG, `Failed to send message, error: ${err}`));
            message.author.sendMessage(`${message.member.displayName}`
                + ', we have a daily mention limit for members on our server to prevent spam, one which '
                + 'you have broken our rules in exceeding. This is your last warning, if you mention again '
                + 'before you\'re allowed you will be muted in all channels for a time and the community '
                + 'staff will be notified. Please use "!mentions" at any time to check your allowance.')
                .then(() => logger.info(TAG, `${message.member.displayName} was sent a warning for `
                    + 'exceeding their member mention allowance'))
                .catch(err => logger.warning(TAG, `Message failed to send, error: ${err}`));
            return true;
        }
        if (list[message.author.id].memberWarnings >= 2) {
            list[message.author.id].memberWarnings++;
            issueMute(message);
            return true;
        }
    }
    // Check user's role mentions
    if (
        list[message.author.id].roleMentions >= config.get('roleMentionLimit')
        && list[message.author.id].roleAction
    ) {
        list[message.author.id].roleAction = false;
        if (list[message.author.id].roleWarnings === 0) {
            list[message.author.id].roleWarnings++;
            message.channel.sendMessage(`${message.member.displayName} you have hit our daily `
                + 'mention limit for roles. You may not mention another role this 24 hour period. '
                + 'Please use "!mentions" to check your allowance before you mention again.')
                .then(() => logger.info(TAG, `${message.member.displayName} hit their role mention limit`))
                .catch(err => logger.warning(TAG, `Message failed to send, error: ${err}`));
            return true;
        }
        if (list[message.author.id].roleWarnings === 1) {
            list[message.author.id].roleWarnings++;
            message.reply('do not mention again. I\'ve sent you a DM that I strongly suggest you read now.')
                .then(() => logger.info(TAG, `${message.member.displayName} exceeded their role mention limit`))
                .catch(err => logger.warning(TAG, `Failed to send message ${err}`));
            message.author.sendMessage(`${message.member.displayName}`
                + ', we have a daily mention limit on our server to prevent spam, one which have you '
                + 'have broken our rules in exceeding. This is your last warning, if you mention again '
                + 'before you\'re allowed you will be muted in all channels for '
                + `${config.get('mentionsMuteTime') / 3600000} hours and thecommunity staff will be `
                + 'notified. Please use "!mentions" at any time to check your allowance.')
                .then(() => logger.info(TAG, `${message.member.displayName} was sent a warning for exceeding `
                    + 'their allowance'))
                .catch(err => logger.warning(TAG, `Message failed to send, error: ${err}`));
            return true;
        }
        if (list[message.author.id].roleWarnings >= 2) {
            list[message.author.id].roleWarnings++;
            issueMute(message);
            return true;
        }
    }
    return false;
}

/* Confirm if the message actually contains a mention at the specified index, if it does return an
identifying portion */
function confirmMention(message, mentionIndex) {
    if (
        message.substring(mentionIndex + 2, mentionIndex + 3) !== '&'
        && isNaN(message.substring(mentionIndex + 2, mentionIndex + 3)) // eslint-disable-line no-restricted-globals
    ) { // eslint-disable-line no-restricted-globals
        return false;
    }
    if (isNaN(message.substring(mentionIndex + 3, mentionIndex + 4))) { // eslint-disable-line no-restricted-globals
        return false;
    }
    if (isNaN(message.substring(mentionIndex + 4, mentionIndex + 5))) { // eslint-disable-line no-restricted-globals
        return false;
    }
    if (isNaN(message.substring(mentionIndex + 5, mentionIndex + 6))) { // eslint-disable-line no-restricted-globals
        return false;
    }
    if (isNaN(message.substring(mentionIndex + 6, mentionIndex + 7))) { // eslint-disable-line no-restricted-globals
        return false;
    }

    return message.substring(mentionIndex + 2, mentionIndex + 7);
}

// Add member mentions to list object
function countMentions(message) {
    // Count member mentions
    if (message.mentions.users.array().length > 0) {
        if (!list[message.author.id]) { trackUser(message.author.id); }
        list[message.author.id].memberMentions += message.mentions.users.array().length;
        list[message.author.id].check = true;
        list[message.author.id].memberAction = true;
    }
    // Count role mentions
    if (message.mentions.roles.array().length > 0) {
        if (!list[message.author.id]) { trackUser(message.author.id); }
        list[message.author.id].roleMentions += message.mentions.roles.array().length;
        list[message.author.id].check = true;
        list[message.author.id].roleAction = true;
    }
}

// Message staff channel about mute
function informStaff(message) {
    server.getChannel('staff').sendMessage(`${message.member.displayName} was muted for `
        + `${config.get('mentionsMuteTime') / 3600000} hours for ignoring multiple warnings of mention spam`)
        .then(() => logger.info(TAG, 'Informed staff of mute'))
        .catch(err => logger.warning(TAG, err));
}

// Issue a supermute, triggered by message
function issueMute(message) {
    message.reply('is now muted due to ignoring warnings of excessive mention spam');
    message.member.addRole(server.getRole(config.get('general.superMuteRoleID')))
        .then(() => logger.debug(TAG, 'Succesfully added mute role'))
        .catch(err => logger.warning(TAG, `Failed to add mute role to member, error: ${err}`));
    message.author.sendMessage('You have repeatedly exceeded your mention limit despite '
        + `repeated warnings. You have now been muted for ${(config.get('mentionsMuteTime') / 3600000)} `
        + ' hours and the community staff have been informed.');
    const now = new Date();
    list[message.author.id].muted = now.getTime();
    list[message.author.id].member = message.member;
    informStaff(message);
}

// If a user is not currently tracked create an object for them in the user list
function trackUser(userID) {
    list[userID] = {
        memberMentions: 0,
        memberWarnings: 0,
        roleMentions: 0,
        roleWarnings: 0,
        muted: false,
        check: false,
    };
}
