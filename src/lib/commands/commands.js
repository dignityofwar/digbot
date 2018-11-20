//  Copyright © 2018 DIG Development team. All rights reserved.

'use strict';

// Master module for commands, redirects to other modules

// Command modules
const admin = require('./admin.js');
const catfacts = require('./catfacts.js');
const cats = require('./cats.js');
const channels = require('./channel.js');
const dragons = require('./dragons.js');
const help = require('./help.js');
const lmgtfy = require('./lmgtfy.js');
const mentions = require('./mentions.js');
const ping = require('./ping.js');
const play = require('./play.js');
const poll = require('./poll.js');
const positions = require('./positions.js');
const ps2digfeedback = require('./ps2digfeedback.js');
const restart = require('./restart.js');
const sfx = require('./sfx.js');
const sort = require('./sort.js');
const started = require('./started.js');
const stats = require('./stats.js');

// Other modules
const config = require('config');
const logger = require('../logger.js');
const server = require('../server/server.js');

const TAG = 'commands';

module.exports = {
    // List all commands that are used by the bot here
    all: [
        '!admin',
        '!catfacts',
        '!cats',
        '!channel',
        '!dragons',
        '!help',
        '!lmgtfy',
        '!mentions',
        '!ping',
        '!play',
        '!poll',
        '!positions',
        '!ps2digfeedback',
        '!help',
        '!restart',
        '!roles',
        '!sfx',
        '!sort',
        '!started',
        '!stats',
        '!vote',
    ],

    // ---- Exported code functions ----

    // Checks for a valid command
    check(message) {
        if (this.filter(message, 'all')) {
            return true;
        }
        logger.info(TAG, `Could not recognise command: ${message}`);
        return false;
    },

    // Filters the command out from the message
    filter(message, list) {
        let filtered = message;
        filtered = message.toLowerCase();
        const commandList = this[list];
        for (let i = 0; i < commandList.length; i += 1) {
            if (filtered.startsWith(commandList[i])) {
                return commandList[i];
            }
        }
        return false;
    },

    // Sends the command to the function, rather than doing a bunch of IF statements
    proxy(msg) {
        // Strip out the ! so we can proxy it to the command function
        const command = msg.content.split(' ')[0].replace('!', '');

        // Check if the command function actually exists
        if (Object.prototype.hasOwnProperty.call(module.exports, command)) {
            return this[command](msg);
        }
        logger.warning(TAG, `Command "${command}" does not exist`);
        return false;
    },

    ready() {
        help.ready();
        sfx.ready();
        play.ready();
    },

    // ---- Commands ----

    admin(msg) {
        if (!adminCheck(msg)) { return false; }
        module.exports.sendMessage(admin.execute(msg.member), msg);
        return true;
    },

    catfacts(msg) {
        module.exports.sendMessage(catfacts.execute(), msg);
    },

    cats(msg) {
        if (msg.content.endsWith('gif')) {
            cats.gif()
                .then((result) => {
                    module.exports.sendMessage(result, msg);
                })
                .catch((err) => {
                    logger.warn(TAG, `Promise reject cats gif: ${err}`);
                });
        } else {
            cats.img()
                .then((result) => {
                    module.exports.sendMessage(result, msg);
                })
                .catch((err) => {
                    logger.warn(TAG, `Promise reject cats img: ${err}`);
                });
        }
    },

    channel(msg) {
        return channels.execute(msg);
    },

    dragons(msg) {
        return dragons.execute(msg);
    },

    help(msg) {
        let reply = help.execute(msg);
        if (typeof reply === 'string') {
            module.exports.sendMessage(reply, msg);
        } else if (typeof reply === 'number') {
            module.exports.sendMessage(`I'll PM you the full command list ${msg.member.displayName}`,
                msg);
            const x = reply + 1;
            for (let i = 0; i < x; i += 1) {
                reply = help.helpFull(i);
                msg.author.sendMessage(reply);
            }
        }
    },

    helppass() {
        return help.pass();
    },

    lmgtfy(msg) {
        module.exports.sendMessage(lmgtfy.execute(msg), msg);
    },

    mentions(msg) {
        mentions.execute(msg);
    },

    ping(msg) {
        ping.execute(msg);
    },

    play(msg) {
        play.execute(msg);
    },

    poll(msg) {
        module.exports.sendMessage(poll.execute(msg), msg);
    },

    positions(msg) {
        if (!adminCheck(msg)) { return false; }
        module.exports.sendMessage(positions.execute(msg.member), msg);
        return true;
    },

    ps2digfeedback(msg) {
        ps2digfeedback.execute(msg);
    },

    restart(msg) {
        if (!adminCheck(msg)) { return false; }
        restart.execute(msg);
        return true;
    },

    roles(msg) {
        if (!adminCheck(msg)) { return false; }
        let output = '';
        server.getGuild(config.get('general.server')).roles.forEach((role) => {
            output += `**${role.id}**: ${role.name}\n`;
        });
        module.exports.sendMessage(output, msg);
        return true;
    },

    sfx(msg) {
        sfx.execute(msg);
    },

    sort(msg) {
        if (!adminCheck(msg)) { return false; }
        module.exports.sendMessage(sort.execute(), msg);
        return false;
    },

    started(msg) {
        const date = `Started: ${server.started.toDateString()} ${server.started.toLocaleString()}`;
        module.exports.sendMessage(date, msg);
        module.exports.sendMessage(started.duration(server.started), msg);
    },

    stats(msg) {
        stats.execute(msg);
    },

    vote(msg) {
        module.exports.sendMessage(poll.vote(msg), msg);
    },

    sendMessage,
};

// Sends messages to channels
function sendMessage(toSend, msg) {
    let options = {};
    let sendable = toSend;
    // Embed if only image is being sent as link
    if (sendable.indexOf(' ') === -1) {
        if (sendable.indexOf('.jpg') !== -1 || sendable.indexOf('.png') !== -1 || sendable.indexOf('.gif') !== -1 ||
             sendable.indexOf('.jpeg') !== -1) {
            options = { embed: { image: { url: sendable } } };
            sendable = '';
        }
    }
    msg.channel.sendMessage(sendable, options)
        .then((message) => {
            if (message.content !== '') {
                logger.info(TAG, `Sent message: ${message.content}`);
            } else {
                logger.info(TAG, `Sent message: ${options.embed.image.url}`);
            }
        })
        .catch((error) => {
            logger.warning(TAG, `Message failed to send, error: ${error}`);
        });
}

// Checks if a member should have access to the admin commands
function adminCheck(msg) {
    if (config.util.getEnv('NODE_ENV') !== 'production') { return true; } // Always allow staging / dev
    if (msg.member.roles.has(config.get('general.devRoleID'))) { return true; }
    if (msg.member.roles.has(config.get('general.staffRoleID'))) { return true; }
    sendMessage(`Sorry ${msg.member.displayName} but only staff members and devs ` +
        'have access to admin commands', msg);
    return false;
}
