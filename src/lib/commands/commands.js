//  Copyright © 2018 DIG Development team. All rights reserved.

'use strict';

// Master module for commands, redirects to other modules
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
    check: function(message) {
        if (this.filter(message, 'all')) {
            return true;
        }
        logger.info(TAG, 'Could not recognise command: ' + message);
        return false;
    },

    // Filters the command out from the message
    filter: function(message, list) {
        if (list === undefined) {
            list = 'all';
        }
        message = message.toLowerCase();
        let commandList = this[list];
        for (let i = 0; i < commandList.length; i++) {
            if (message.startsWith(commandList[i])) {
                return commandList[i];
            }
        }
        return false;
    },

    // Sends the command to the function, rather than doing a bunch of IF statements
    proxy: function(msg) {
        // Strip out the ! so we can proxy it to the command function
        let command = msg.content.split(' ')[0].replace('!', '');

        // Check if the command function actually exists
        if (module.exports.hasOwnProperty(command)) {
            return this[command](msg);
        } else {
            logger.warning(TAG, 'Command \"' + command + '\" does not exist');
            return false;
        }
    },

    ready: function() {
        help.ready();
        sfx.ready();
        play.ready();
    },

    // ---- Commands ----

    admin: function(msg) {
        if (!adminCheck(msg)) { return false; }
        module.exports.sendMessage(admin.execute(msg.member), msg);
    },

    catfacts: function(msg) {
        module.exports.sendMessage(catfacts.execute(), msg);
    },

    cats: function(msg) {
        if (msg.content.endsWith('gif')) {
            cats.gif()
                .then(result => {
                    module.exports.sendMessage(result, msg);
                });
        } else {
            cats.img()
                .then(result => {
                    module.exports.sendMessage(result, msg);
                });
        }
    },

    channel: function(msg) {
        return channels.execute(msg);
    },

    dragons: function(msg) {
        return dragons.execute(msg);
    },

    help: function(msg) {
        let reply = help.execute(msg);
        if (typeof reply === 'string') {
            module.exports.sendMessage(reply, msg);
        } else if (typeof reply === 'number') {
            module.exports.sendMessage('I\'ll PM you the full command list ' +
                msg.member.displayName, msg);
            let x = reply + 1;
            for (let i = 0; i < x; i++) {
                reply = help.helpFull(i);
                msg.author.sendMessage(reply);
            }
        }
    },

    helppass: function() {
        return help.pass();
    },

    lmgtfy: function(msg) {
        module.exports.sendMessage(lmgtfy.execute(msg), msg);
    },

    mentions: function(msg) {
        mentions.execute(msg);
    },

    ping: function(msg) {
        ping.execute(msg);
    },

    play: function(msg) {
        play.execute(msg);
    },

    poll: function(msg) {
        module.exports.sendMessage(poll.execute(msg), msg);
    },

    positions: function(msg) {
        if (!adminCheck(msg)) { return false; }
        module.exports.sendMessage(positions.execute(msg.member), msg);
    },

    ps2digfeedback: function(msg) {
        ps2digfeedback.execute(msg);
    },

    restart: function(msg) {
        if (!adminCheck(msg)) { return false; }
        restart.execute(msg);
    },

    roles: function(msg) {
        if (!adminCheck(msg)) { return false; }
        let output = '';
        server.getGuild(config.get('general.server')).roles.forEach(function(role) {
            output += '**' + role.id + '**: ' + role.name + '\n';
        });
        msg.author.sendMessage(output);
    },

    sfx: function(msg) {
        sfx.execute(msg);
    },

    sort: function(msg) {
        if (!adminCheck(msg)) { return false; }
        module.exports.sendMessage(sort.execute(), msg);
    },

    started: function(msg) {
        // let date = 'Started: ' + server.started.toDateString() + ' ' + server.started.toLocaleString();
        // module.exports.sendMessage(date, msg);
        module.exports.sendMessage(started.duration(server.started), msg);
    },

    stats: function(msg) {
        stats.execute(msg);
    },

    vote: function(msg) {
        module.exports.sendMessage(poll.vote(msg), msg);
    },

    sendMessage: sendMessage
};

// Sends messages to channels
function sendMessage(toSend, msg) {
    let options = {};
    // Embed if only image is being sent as link
    if (toSend.indexOf(' ') === -1) {
        if (toSend.indexOf('.jpg') !== -1 || toSend.indexOf('.png') !== -1 || toSend.indexOf('.gif') !== -1 ||
             toSend.indexOf('.jpeg') !== -1) {
            options = {embed: {image: {url: toSend}}};
            toSend = '';
        }
    }
    msg.channel.sendMessage(toSend, options)
        .then(message => {
            if (message.content !== '') {
                logger.info(TAG, `Sent message: ${message.content}`);
            } else {
                logger.info(TAG, `Sent message: ${options.embed.image.url}`);
            }
        })
        .catch(error => {
            logger.warning(TAG, `Message failed to send, error: ${error}`);
        });
}

// Checks if a member should have access to the admin commands
function adminCheck(msg) {
    if (config.util.getEnv('NODE_ENV') !== 'production') { return true; } // Always allow staging / dev
    if (msg.member.roles.has(config.get('general.devRoleID'))) { return true; }
    if (msg.member.roles.has(config.get('general.staffRoleID'))) {return true; }
    sendMessage(`Sorry ${msg.member.displayName} but only staff members and devs ` +
        `have access to admin commands`, msg);
    return false;
}
