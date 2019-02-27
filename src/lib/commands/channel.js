const Command = require('./foundation/command');
const channelsMaster = require('../admin/channels/channelsMaster.js');
const help = require('./help.js');
const logger = require('../logger.js');

const TAG = '!channel';

module.exports = class ChannelCommand extends Command {
    constructor() {
        super();

        this.name = 'channel';
        this.onlyHelpFull = true;
    }

    /**
     * @param request
     * @return {Promise<void>}
     */
    async execute({ message: msg }) {
        // Filter out key parts of message
        const action = filterAction(msg);
        if (!action) { return; }
        const type = filterType(msg);
        if (!type) { return; }
        let name = filterName(msg);

        // If user is attempting to create channel
        if (action === 'create') {
            name = nameCheckCreate(name, type);
            if (name === false) {
                await msg.channel.sendMessage(
                    'Sorry I can\'t make that channel, channel names have to be alphanumeric.',
                )
                    .then(message => logger.info(TAG, `Sent message: ${message.content}`))
                    .catch(err => logger.warning(TAG, `Failed to send message, error: ${err}`));
                return;
            }
            if (name.length < 2 || name.length > 100) {
                await msg.channel.sendMessage('Sorry I can\'t make that channel, channel names have to be '
                    + 'between 2 and 100 characters in length.')
                    .then(message => logger.info(TAG, `Sent message: ${message.content}`))
                    .catch(err => logger.warning(TAG, `Failed to send message, error: ${err}`));
                return;
            }
            if (!duplicationCheck(name, type, msg)) {
                return;
            }
            // Checks complete, create channel
            if (type === 'text') {
                await msg.guild.defaultChannel.clone(name)
                    .then(() => logger.debug(TAG, 'Succesfully created text channel'))
                    .catch(err => logger.warning(TAG, `Failed to create text channel, error: ${err}`));
            } else {
                await msg.guild.createChannel(name, type)
                    .then(() => logger.debug(TAG, 'Succesfully created voice channel'))
                    .catch(err => logger.warning(TAG, `Failed to create voice channel, error: ${err}`));
            }
            await msg.channel.sendMessage(`The ${type} channel ${name} has been created`)
                .then(message => logger.info(TAG, `Sent message: ${message.content}`))
                .catch(err => logger.warning(TAG, `Failed to send message ${err}`));
            return;
        }

        // If user is attempting to delete channel
        if (action === 'delete') {
            name = nameCheckDelete(name, type);
            manDelete(msg, type, name);
        }
    }

    /**
     * @param {boolean} full
     * @return {string}
     */
    help() {
        return 'Used to create and delete temporary channels denoted by "-t-", works for both voice and text.';
    }
};

//  Copyright © 2018 DIG Development team. All rights reserved.

/* This module handles all '!channel' command messages,
Messages form: '!channel action type name' Ex: '!channel create text Planetside2' */


// Check for channels by the same name, if one already exists, stop the creation
function duplicationCheck(name, type, msg) {
    for (const ch of msg.guild.channels) {
        if (name === ch[1].name && type === ch[1].type) {
            msg.channel.sendMessage('Sorry I can\'t make that channel, we already have a temporary '
                + 'channel by that name')
                .then(message => logger.info(TAG, `Sent message: ${message.content}`))
                .catch(err => logger.warning(TAG, `Failed to send message, error: ${err}`));
            return false;
        }
    }
    return true;
}

// Identifies and returns the action contained in the command
function filterAction(msg) {
    if (msg.content.length < 9) {
        msg.channel.sendMessage(help.detailsPass('channel'))
            .then(message => logger.info(TAG, `Sent message: ${message.content}`))
            .catch(err => logger.warning(TAG, `Failed to send message, error: ${err}`));
        return false;
    }
    if (msg.content.substring(9).startsWith('create')) {
        return 'create';
    }
    if (msg.content.substring(9).startsWith('delete')) {
        return 'delete';
    }
    msg.channel.sendMessage('Sorry I don\'t understand that action, the action must be '
        + 'either *"create"* or *"delete"* in: *"!channel action type name"*. Example: '
        + '*"!channel create voice EVE Online"*')
        .then(message => logger.info(TAG, `Sent message: ${message.content}`))
        .catch(err => logger.warning(TAG, `Failed to send message ${err}`));
    return false;
}

// Identifies and returns the channel name contained in the command
function filterName(msg) {
    if (msg.content.substring(16).startsWith('text')) {
        return msg.content.substring(21);
    }
    if (msg.content.substring(16).startsWith('voice')) {
        return msg.content.substring(22);
    }
    return '';
}

// Identifies and returns the type contained in the command
function filterType(msg) {
    if (msg.content.substring(16).startsWith('text')) {
        return 'text';
    }
    if (msg.content.substring(16).startsWith('voice')) {
        return 'voice';
    }
    msg.channel.sendMessage('Sorry I don\'t understand that type, the type must be either '
        + '*"create"* or *"delete"* in: "!channel action type name". Example: "!channel create voice EVE Online"')
        .then(message => logger.info(TAG, `Sent message: ${message.content}`))
        .catch(err => logger.warning(TAG, `Failed to send message, error: ${err}`));
    return false;
}

// If command is attempting to delete channel, scan for it and pass it on to deleteinactive
function manDelete(msg, type, name) {
    for (const ch of msg.guild.channels) {
        if (ch[1].type === type && ch[1].name.endsWith('-t-')) {
            if (ch[1].name === name || ch[1].name.substring(0, (ch[1].name.length - 3)) === name) {
                channelsMaster.deleteInactive(ch[1], msg);
                return;
            }
        }
    }
    msg.channel.sendMessage('Sorry I couldn\'t find a deletable channel by that name to delete, '
        + 'be sure you spelt the channel\'s name correctly and you\'re specifying the right '
        + 'type of channel. Temp channels are deleted every 2 hours.')
        .then(message => logger.info(TAG, `Sent message: ${message.content}`))
        .catch(err => logger.warning(TAG, `Failed to send message, error: ${err}`));
}

/* eslint no-param-reassign: off */

// Filter name format for creations, returns false if name can't be made suitable
function nameCheckCreate(name, type) {
    if (type !== 'voice') {
        while (name.indexOf(' ') !== -1) {
            name = name.replace(' ', '-');
        }
    }
    while (name.indexOf('_') !== -1) {
        name = name.replace('_', '-');
    }
    if (type === 'text' && /[^a-zA-Z0-9\-_]/.test(name)) {
        return false;
    }
    if (type === 'voice' && /[^a-zA-Z0-9\-\s_]/.test(name)) {
        return false;
    }
    if (!name.endsWith('-t-')) {
        name += '-t-';
    }
    if (!name.startsWith('⏳ ') && type === 'voice') {
        name = `⏳ ${name}`;
    }
    return name;
}

// Filter name format for deletions
function nameCheckDelete(name, type) {
    while (name.indexOf(' ') !== -1) {
        name = name.replace(' ', '_');
    }
    if (type === 'voice' && name.indexOf('⏳') === -1) {
        name = `⏳ ${name}`;
    }
    return name;
}
