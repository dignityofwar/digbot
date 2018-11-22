//  Copyright © 2018 DIG Development team. All rights reserved.

'use strict';

// This module handles all bot events and acts upon them

const admin = require('../admin/admin.js');
const commands = require('../commands/commands.js');
const config = require('config');
const directMessage = require('./direct-message.js');
const crashHandler = require('../crash-handling.js');
const logger = require('../logger.js');
const nameCheck = require('../welcomepack/namecheck.js');
const pjson = require('../../../package.json');
const server = require('../server/server.js');
const subBots = require('../sub-bots/sub-bots.js');
const welcome = require('../welcomepack/welcomepack.js');

const TAG = 'bot-events';

module.exports = {
    channelCreate(channel, bot) {
        if (channel.type === 'dm' || channel.type === 'group') { return false; }
        if (!channel || !channel.guild) { return false; }
        if (checkIfValid(channel.guild.id) === false) { return false; }
        server.saveGuild(channel.guild.id, bot.guilds.get(config.get('general.server')));
        admin.checkCreation(channel);
        return true;
    },

    channelDelete(channel, bot) {
        if (channel.type === 'dm' || channel.type === 'group') { return false; }
        if (!channel || !channel.guild) { return false; }
        if (checkIfValid(channel.guild.id) === false) { return false; }
        server.saveGuild(channel.guild.id, bot.guilds.get(config.get('general.server')));
        return true;
    },

    channelUpdate(oldChannel, newChannel, bot) {
        if (newChannel.type === 'dm' || newChannel.type === 'group') { return false; }
        if (!oldChannel || !newChannel || !newChannel.guild) { return false; }
        if (checkIfValid(newChannel.guild.id) === false) { return false; }
        server.saveGuild(newChannel.guild.id, bot.guilds.get(config.get('general.server')));
        admin.checkPositions();
        return true;
    },

    debug(info) {
        logger.debug(TAG, `Debug info recieved from bot: ${info}`);
    },

    disconnectEvent() {
        logger.botStatus(TAG, 'Client disconected');
        server.wipeGuild(config.get('general.server'));
        server.markAsNotReady();
    },

    guildCreate(guild, bot) {
        if (server.getBooted() === false) { return false; }
        server.saveGuild(guild.id, bot.guilds.get(config.get('general.server')));
        return true;
    },

    guildDelete(guild) {
        if (server.getBooted() === false) { return false; }
        logger.devAlert(`Left ${guild.name} guild`);
        return true;
    },

    guildMemberAdd(member, bot) {
        if (checkIfValid(member.guild.id) === false) { return false; }
        if (welcome.check(member)) {
            if (server.getChannel('general') !== null) {
                server.getChannel('general').sendMessage(`Welcome to DIG, **${member.displayName}**!`)
                    .then(() => {
                        logger.info(TAG, 'Sent #general message');
                    })
                    .catch((err) => {
                        logger.warning(TAG, `Message failed to send ${err}`);
                    });
            }
        }
        nameCheck.execute(member);
        admin.joinChecks(member);
        admin.checkPlaying(member);
        server.saveGuild(member.guild.id, bot.guilds.get(config.get('general.server')));
        server.setMembersOnServer(member.guild, 1);
        admin.presenceUpdate();
        return true;
    },

    guildMemberRemove(member, bot) {
        if (checkIfValid(member.guild.id) === false) { return false; }
        logger.info(`${member.displayName} left the server`);
        server.saveGuild(member.guild.id, bot.guilds.get(config.get('general.server')));
        server.setMembersOnServer(member.guild, -1);
        admin.presenceUpdate();
        return true;
    },

    guildMemberUpdate(oldMember, newMember) {
        if (checkIfValid(newMember.guild.id) === false) { return false; }
        nameCheck.execute(newMember);
        admin.memberUpdate(oldMember, newMember);
        return true;
    },

    guildUpdate(oldGuild, newGuild, bot) {
        if (checkIfValid(newGuild.id) === false) { return false; }
        server.saveGuild(newGuild.id, bot.guilds.get(config.get('general.server')));
        return true;
    },

    message(msg) {
        const prefix = '!';

        if (msg.author.bot) { return false; } // Ignore if a bot
        crashHandler.logMessage(msg);

        // Handle DMs
        if (msg.channel.type === 'dm' || msg.channel.type === 'group') {
            crashHandler.logEvent(TAG, 'directMessage');
            directMessage.handle(msg);
            return false;
        }

        // Check message is for correct server
        if (checkIfValid(msg.guild.id) === false) { return false; }

        // Check if the command originated from whitelisted channels
        if (!admin.commandChannel(msg)) { return false; }

        // Run admin checks. Stop if the message is invalid.
        if (!admin.check(msg)) { return false; }

        // Ignore if no prefix
        if (!msg.content.startsWith(prefix)) { return false; }

        // Ignore if not command
        if (!commands.check(msg.content)) { return false; }

        // Calls antispam function from antispam.js to prevent people spamming the bot
        if (!admin.antispamCheck(msg)) { return false; }

        /* BROKEN STILL. SEE #50.
        msg.channel.startTyping(msg.channel);

        // Set a timeout after 5 seconds in case it doesn't get sent for some reason
        setTimeout(() => {
            msg.channel.stopTyping();
            logger.warning(TAG, 'stopTyping timeout executed...');
        }, 5000);
        */

        // Send command to command module for processing
        commands.proxy(msg); // Pass the command to the commands.js proxy to be executed.
        return true;
    },

    messageUpdate(oldMessage, newMessage) {
        // Ignore DMs
        if (newMessage.channel.type === 'dm' || newMessage.channel.type === 'group') {
            return false;
        }

        // Check message is for correct server
        if (checkIfValid(newMessage.guild.id) === false) { return false; }

        admin.checkEdits(oldMessage, newMessage);
        return true;
    },

    // When a user starts playing a game, check if they have the relevent roles
    presenceUpdate(oldMember, newMember) {
        if (!checkIfValid(newMember.guild.id)) { return false; }
        admin.checkPlaying(oldMember, newMember);
        server.saveGuild(config.get('general.server'), newMember.guild);
        server.setMembersPlaying();
        admin.presenceUpdate();
        return true;
    },

    ready(bot) {
        if (server.getBooted() === true) {
            logger.botStatus(TAG, 'Client succesfully reconnected');
            server.saveGuild(config.get('general.server'), bot.guilds.get(config.get('general.server')));
            server.setConnectedSince();
            server.markAsReady();
            server.setMembersOnServer(bot.guilds.get(config.get('general.server')));
            logger.info(TAG, 'DIGBot, Online.');
            return;
        }

        logger.info(TAG, 'DIGBot, Online.');
        server.setConnectedSince();

        assignChannelStorage(bot);

        if (server.getBooted() === false) {
            if (server.getChannel('developers') !== null) {
                server.getChannel('developers').sendMessage('DIGBot, reporting for duty! '
                    + `Environment: ${config.util.getEnv('NODE_ENV')}, Version: ${pjson.version}`)
                    .then(() => {
                        logger.debug(TAG, 'Succesfully sent message');
                    })
                    .catch((err) => {
                        logger.warning(TAG, `Failed to send message error: ${err}`);
                    });
            }
        }

        // Store the data for usage from other modules
        server.saveGuild(config.get('general.server'), bot.guilds.get(config.get('general.server')));
        server.setMembersOnServer(bot.guilds.get(config.get('general.server')));
        logger.info(TAG, 'Server member count: '
            + `${server.getGuild(config.get('general.server')).memberCount}`);

        commands.ready();
        admin.ready();
        setTimeout(admin.startchecks, 2000);

        subBots.ready();

        server.started = new Date();
        server.markAsReady();
        server.markBooted();
    },

    reconnecting() {
        if (server.getBooted() === false) { return false; } // Ignore if bot never truly booted
        logger.botStatus(TAG, 'Client disconected, attempting reconnection...');
        logger.warning(TAG, 'Bot got disconnected from Discord, reconnecting...');
        server.wipeGuild(config.get('general.server'));
        return false;
    },

    roleCreate(role, bot) {
        if (!checkIfValid(role.guild.id)) { return false; }
        server.saveGuild(role.guild.id, bot.guilds.get(config.get('general.server')));
        return false;
    },

    roleDelete(role, bot) {
        if (!checkIfValid(role.guild.id)) { return false; }
        server.saveGuild(role.guild.id, bot.guilds.get(config.get('general.server')));
        return false;
    },

    roleUpdate(oldRole, newRole, bot) {
        if (!checkIfValid(newRole.guild.id)) { return false; }
        server.saveGuild(newRole.guild.id, bot.guilds.get(config.get('general.server')));
        return false;
    },

    voiceStateUpdate(oldMember, newMember) {
        if (!checkIfValid(newMember.guild.id)) { return false; }
        admin.modularChannels(oldMember, newMember);
        return false;
    },

    warning(warning) {
        logger.warning(TAG, `Warning: ${warning}`);
    },
};

// Checks if the bot should not take action on the event for some reason (bot not ready or wrong server)
function checkIfValid(guildID) {
    if (guildID !== config.get('general.server')) { return false; }
    if (server.getReady() === false || server.getBooted() === false) { return false; }
    return true;
}

// Iterates through channel objects that the bot has access to, take action on relevant channels
function assignChannelStorage(bot) {
    for (const ch of bot.channels) {
        if (ch[1].id === config.get('channels.mappings.developers')) {
            server.setChannel('developers', ch[1]);
        }

        if (ch[1].id === config.get('channels.mappings.digBotLog')) {
            server.setChannel('digBotLog', ch[1]);
            logger.setChannel(ch[1]);
        }

        if (ch[1].id === config.get('channels.mappings.staff')) {
            server.setChannel('staff', ch[1]);
        }

        if (ch[1].id === config.get('channels.mappings.general')) {
            server.setChannel('general', ch[1]);
        }

        if (ch[1].id === config.get('channels.mappings.events')) {
            server.setChannel('events', ch[1]);
        }

        if (ch[1].id === config.get('channels.mappings.streams')) {
            server.setChannel('streams', ch[1]);
        }

        if (ch[1].id === config.get('channels.mappings.herebedragons')) {
            server.setChannel('herebedragons', ch[1]);
        }

        if (ch[1].id === config.get('channels.mappings.digbot')) {
            server.setChannel('digbot', ch[1]);
        }

        if (ch[1].id === config.get('channels.mappings.chitChatVoice')) {
            server.setChannel('digChitChatVoice', ch[1]);
        }

        if (ch[1].id === config.get('channels.mappings.ps2dig')) {
            server.setChannel('ps2dig', ch[1]);
        }

        if (config.get('tester') !== null && config.get('testerChannel') !== null) {
            if (ch[1].id === config.get('testerChannel')) {
                logger.info(TAG, `Found ${config.get('tester')} channel. Resetting developers`);
                server.setChannel('digbot', ch[1]);
                server.setChannel('developers', ch[1]);
                logger.setChannel(ch[1]);
                logger.setDebugs(true);
            }
        }
    }
}
