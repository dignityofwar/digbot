//  Copyright © 2018 DIG Development team. All rights reserved.

'use strict';

/* This module handles all '!channel' command messages,
Messages form: '!channel action type name' Ex: '!channel create text Planetside2' */

const channelsMaster = require('../admin/channels/channelsMaster.js');
const help = require('./help.js');
const logger = require('../logger.js');

const TAG = '!channel';

module.exports = {
    // Runs on !channel command, kind of a switch for the route we'll be going down
    execute(msg) {
        // Filter out key parts of message
        const action = filterAction(msg);
        if (!action) { return false; }
        const type = filterType(msg);
        if (!type) { return false; }
        let name = filterName(msg);

        // If user is attempting to create channel
        if (action === 'create') {
            name = nameCheckCreate(name, type);
            if (name === false) {
                msg.channel.sendMessage('Sorry I can\'t make that channel, channel names have to be ' +
                    'alphanumeric.')
                    .then((message) => {
                        logger.info(TAG, `Sent message: ${message.content}`);
                    })
                    .catch((err) => {
                        logger.warning(TAG, `Failed to send message, error: ${err}`);
                    });
                return false;
            }
            if (name.length < 2 || name.length > 100) {
                msg.channel.sendMessage('Sorry I can\'t make that channel, channel names have to be ' +
                    'between 2 and 100 characters in length.')
                    .then((message) => {
                        logger.info(TAG, `Sent message: ${message.content}`);
                    })
                    .catch((err) => {
                        logger.warning(TAG, `Failed to send message, error: ${err}`);
                    });
                return false;
            }
            if (!duplicationCheck(name, type, msg)) {
                return false;
            }
            // Checks complete, create channel
            if (type === 'text') {
                msg.guild.defaultChannel.clone(name)
                    .then(() => {
                        logger.debug(TAG, 'Succesfully created text channel');
                    })
                    .catch((err) => {
                        logger.warning(TAG, `Failed to create text channel, error: ${err}`);
                    });
            } else {
                msg.guild.createChannel(name, type)
                    .then(() => {
                        logger.debug(TAG, 'Succesfully created voice channel');
                    })
                    .catch((err) => {
                        logger.warning(TAG, `Failed to create voice channel, error: ${err}`);
                    });
            }
            msg.channel.sendMessage(`The ${type} channel ${name} has been created`)
                .then((message) => {
                    logger.info(TAG, `Sent message: ${message.content}`);
                })
                .catch((err) => {
                    logger.warning(TAG, `Failed to send message ${err}`);
                });
            return true;
        }

        // If user is attempting to delete channel
        if (action === 'delete') {
            name = nameCheckDelete(name, type);
            return manDelete(msg, type, name);
        }

        return false;
    },
};

// Check for channels by the same name, if one already exists, stop the creation
function duplicationCheck(name, type, msg) {
    for (const ch of msg.guild.channels) {
        if (name === ch[1].name && type === ch[1].type) {
            msg.channel.sendMessage('Sorry I can\'t make that channel, we already have a temporary ' +
                'channel by that name')
                .then((message) => {
                    logger.info(TAG, `Sent message: ${message.content}`);
                })
                .catch((err) => {
                    logger.warning(TAG, `Failed to send message, error: ${err}`);
                });
            return false;
        }
    }
    return true;
}

// Identifies and returns the action contained in the command
function filterAction(msg) {
    if (msg.content.length < 9) {
        msg.channel.sendMessage(help.detailsPass('channel'))
            .then((message) => {
                logger.info(TAG, `Sent message: ${message.content}`);
            })
            .catch((err) => {
                logger.warning(TAG, `Failed to send message, error: ${err}`);
            });
        return false;
    } else if (msg.content.substring(9).startsWith('create')) {
        return 'create';
    } else if (msg.content.substring(9).startsWith('delete')) {
        return 'delete';
    }
    msg.channel.sendMessage('Sorry I don\'t understand that action, the action must be ' +
    'either *"create"* or *"delete"* in: *!channel action type name"*. Example: ' +
    '*"!channel create voice EVE Online"*')
        .then((message) => {
            logger.info(TAG, `Sent message: ${message.content}`);
        })
        .catch((err) => {
            logger.warning(TAG, `Failed to send message ${err}`);
        });
    return false;
}

// Identifies and returns the channel name contained in the command
function filterName(msg) {
    if (msg.content.substring(16).startsWith('text')) {
        return msg.content.substring(21);
    } else if (msg.content.substring(16).startsWith('voice')) {
        return msg.content.substring(22);
    }
    return false;
}

// Identifies and returns the type contained in the command
function filterType(msg) {
    if (msg.content.substring(16).startsWith('text')) {
        return 'text';
    } else if (msg.content.substring(16).startsWith('voice')) {
        return 'voice';
    }
    msg.channel.sendMessage('Sorry I don\'t understand that type, the type must be either ' +
        '*"create"* or *"delete"* in: "!channel action type name". Example: ' +
        '"!channel create voice EVE Online"')
        .then((message) => {
            logger.info(TAG, `Sent message: ${message.content}`);
        })
        .catch((err) => {
            logger.warning(TAG, `Failed to send message, error: ${err}`);
        });
    return false;
}

// If command is attempting to delete channel, scan for it and pass it on to deleteinactive
function manDelete(msg, type, name) {
    for (const ch of msg.guild.channels) {
        if (ch[1].type === type && ch[1].name.endsWith('-t-')) {
            if (ch[1].name === name || ch[1].name.substring(0, (ch[1].name.length - 3)) === name) {
                return channelsMaster.deleteInactive(ch[1], msg);
            }
        }
    }
    msg.channel.sendMessage('Sorry I couldn\'t find a deletable channel by that name to delete, ' +
        'be sure you spelt the channel\'s name correctly and you\'re specifying the right ' +
        'type of channel. Temp channels are deleted every 2 hours.')
        .then((message) => {
            logger.info(TAG, `Sent message: ${message.content}`);
        })
        .catch((err) => {
            logger.warning(TAG, `Failed to send message, error: ${err}`);
        });
    return false;
}

// Filter name format for creations, returns false if name can't be made suitable
function nameCheckCreate(name, type) {
    let newName = name;
    if (type !== 'voice') {
        while (newName.indexOf(' ') !== -1) {
            newName = newName.replace(' ', '-');
        }
    }
    while (newName.indexOf('_') !== -1) {
        newName = newName.replace('_', '-');
    }
    if (type === 'text' && /[^a-zA-Z0-9\-_]/.test(newName)) {
        return false;
    }
    if (type === 'voice' && /[^a-zA-Z0-9\-\s_]/.test(newName)) {
        return false;
    }
    if (!newName.endsWith('-t-')) {
        newName += '-t-';
    }
    if (!newName.startsWith('⏳ ') && type === 'voice') {
        newName = `⏳ ${newName}`;
    }
    return newName;
}

// Filter name format for deletions
function nameCheckDelete(name, type) {
    let newName = name;
    while (newName.indexOf(' ') !== -1) {
        newName = newName.replace(' ', '_');
    }
    if (type === 'voice' && newName.indexOf('⏳') === -1) {
        newName = `⏳ ${newName}`;
    }
    return newName;
}
