//  Copyright © 2018 DIG Development team. All rights reserved.

'use strict';

// Antispam module to prevent people spamming the bot

const commands = require('../../commands/commands.js');
const config = require('config');
const crashHandler = require('../../crash-handling.js');
const logger = require('../../logger.js');

const TAG = 'Commands Antispam';
const comms = {};
const spammers = {};
let sendMessage = true; // Remember if the anti spam messages have been posted recently

module.exports = {
    // Check if user is spamming, returns true if not, false for spam but no message, and string for message
    check(msg) {
        // If we choose to have antispam disabled as a developer
        if (config.get('features.disableCommandSpam') === true) {
            logger.debug(TAG, 'Antispam disabled!');
            return true;
        }
        let command = '';
        if (checkSpammer(msg.author)) {
            command = commands.filter(msg.content, 'all');
            return checkCommand(command, msg.member.displayName, msg.channel);
        }
        return userMessage(msg.member.displayName, msg.channel);
    },
};

// Global interval to call antispam user release every X secs
// eslint-disable-next-line no-unused-vars
const timer = setInterval(releaseUser, config.get('antispamUserTick'));

// Second timer to set the amount of commands to be allowed per interval
// eslint-disable-next-line no-unused-vars
const timer2 = setInterval(releaseCommand, config.get('antispamCommandTick'));

// Count user for anti spam after succesful message
function antispamCount(offender) {
    if (offender in spammers) {
        spammers[offender] += 1;
    } else {
        spammers[offender] = 1;
    }
}

// Check if limited commands are being spammed
function checkCommand(command, name, channel) {
    switch (command) {
    case '!cats':
        if (comms.cats >= config.get('antispamCommandLimitCats')) {
            logger.info(TAG, 'Antispam kicked in for command: !cats');
            channel.sendMessage(`${name}, I've decided to severely limit the amount of cats I'm afraid.`)
                    .then(() => {
                        logger.info(TAG, `Sent antipsam message to ${name}`);
                    })
                    .catch((error) => {
                        logger.warning(TAG, `Message failed to send ${error}`);
                    });
            return false;
        }
        commandCount('cats');
        return true;

    default:
        return true;
    }
}

// Check if user is spamming
function checkSpammer(offender) {
    if (spammers[offender] >= config.get('antispamUserLimit')) {
        logger.debug(TAG, `Antispam kicked in for user: ${offender}`);
        return false;
    }
    antispamCount(offender);
    return true;
}

// Count command for antispam after succesful message
function commandCount(command) {
    if (command in comms) {
        comms[command] += 1;
    } else {
        comms[command] = 1;
    }
}

// Called every 5 mins by interval timer
function releaseCommand() {
    crashHandler.logEvent(TAG, 'releaseCommand');
    // Reset spam message so another 'Stop spamming' message can be sent if needed
    sendMessage = true;

    // Iterate through comms object
    for (const x in comms) {
        // If the command has a count on file take the number down by one
        // If it has 0 counts remove it from the object so as not to snowball memory
        if (comms[x] > 1) {
            comms[x] -= 1;
            logger.debug(TAG, `Ticked down command: ${x}`);
        } else if (comms[x] <= 1) {
            delete comms[x];
            logger.debug(TAG, `Released ${x} from command antispam`);
        } else {
            logger.error(
                TAG,
                `error with funtion releaseCommand(), comms[x] not defined for:${x}`,
            );
        }
    }
}

// Called every X seconds by interval timer
function releaseUser() {
    crashHandler.logEvent(TAG, 'releaseUser');
    // Reset spam message so another 'Stop spamming' message can be sent if needed
    sendMessage = true;

    // Iterate through spammers object
    for (const x in spammers) {
        // If the person has a message on file take the number down by one
        // If they have 0 messages remove them from the object so as not to snowball memory
        if (spammers[x] > 1) {
            spammers[x] -= 1;
            logger.debug(TAG, `Ticked down user: ${x}`);
        } else if (spammers[x] <= 1) {
            delete spammers[x];
            logger.debug(TAG, `Released ${x} from spammers`);
        } else {
            logger.error(
                TAG,
                `error with funtion antispamrelease(), spammers[x] not defined for:${x}`,
            );
        }
    }
}

// If a message needs to be sent, format message to be sent
function userMessage(name, channel) {
    if (sendMessage) {
        sendMessage = false;
        channel.sendMessage(`Dammit ${name}, I'm a bot not a slave stop spamming me!`)
            .then(() => {
                logger.info(TAG, `Sent antipsam message to ${name}`);
            })
            .catch((error) => {
                logger.warning(TAG, `Message failed to send ${error}`);
            });
        return false;
    }
    return false;
}
