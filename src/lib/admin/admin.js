//  Copyright © 2018 DIG Development team. All rights reserved.

'use strict';

// Primary administrative module, does things like scan all messages and periodly call other modules

const antispam = require('./antispam/antispam.js');
const autodelete = require('./channels/autodelete.js');
const channels = require('./channels/channelsMaster.js');
const commandChannel = require('./antispam/commandChannel.js');
const config = require('config');
const crashHandler = require('../crash-handling.js');
const detectPlaying = require('./roles/detectplaying.js');
const events = require('./events.js');
const logger = require('../logger.js');
const mentionSpam = require('./antispam/mentionspam.js');
const modularChannelSystem = require('./channels/modularchannels.js');
const forcedPTTCheck = require('./roles/forcedpttcheck.js');
const play = require('../commands/play.js');
const poll = require('../commands/poll.js');
const presence = require('./bot/presence.js');
const sfx = require('../commands/sfx.js');
const server = require('../server/server.js');
const streamSpam = require('./antispam/streamspam.js');

const TAG = 'admin.js';

module.exports = {
    antispamCheck: function(msg) {
        return antispam.check(msg);
    },

    /* Check is the main function of admin.js, it will call other functions to perform admin checks
    on the message, all server messages will run through the check function. */
    check: function(msg) {
        if (msg.guild.id === config.get('general.server')) {
            streamSpam.execute(msg);
            mentionSpam.execute(msg);
            return true;
        }

        // If completely invalid, e.g. not from our server
        return false;
    },

    // Check created channel is valid
    checkCreation: function(channel) {
        channels.checkCreation(channel);
    },

    // Check edited messages
    checkEdits: function(oldMessage, newMessage) {
        streamSpam.execute(newMessage);
        mentionSpam.edits(oldMessage, newMessage);
    },

    // Check if fed member is playing a community game, if so give them the game's role if they don't have it
    checkPlaying: function(oldMember, newMember) {
        return detectPlaying.check(oldMember, newMember);
    },

    // Calls a global check of all channel positions
    checkPositions: function() {
        channels.checkPositions();
    },

    commandChannel: function(msg) {
        return commandChannel.execute(msg);
    },

    // Checks to perform on a member when they join the server
    joinChecks(member) {
        mentionSpam.joinCheck(member);
    },

    memberUpdate: function(oldMember, newMember) {
        mentionSpam.memberUpdate(oldMember, newMember);
        forcedPTTCheck.execute(oldMember, newMember);
    },

    modularChannels: function(oldMember, newMember) {
        modularChannelSystem.execute(oldMember, newMember);
    },

    presenceUpdate: function() {
        // presence.execute();
    },

    // Called on bot.ready
    ready: function() {
        events.ready();
        commandChannel.ready();
    },

    // Called on bot.ready after a short delay
    startchecks: function() {
        crashHandler.logEvent(TAG, 'startchecks');
        channels.checkPositions();
        // presence.execute();
    },
};



// Remove members from server that have exceeded our inactivity limit
function prune() {
    if (server.getGuild(config.get('general.server')) === null) { return; }
    server.getGuild(config.get('general.server')).pruneMembers(config.get('inactivityLimit'))
        .then(pruned => {
            if (pruned > 0) {
                logger.devAlert(TAG, `${pruned} members pruned`);
            }
        })
        .catch(err => {
            logger.warning(TAG, `Failed to prune members, error ${err}`);
        });
}
