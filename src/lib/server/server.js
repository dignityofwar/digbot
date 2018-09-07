//  Copyright © 2018 DIG Development team. All rights reserved.

'use strict';

// Module to store server data

const config = require('config');
const crashHandler = require('../crash-handling.js');
const logger = require('../logger.js');
const TAG = 'server';
let users = []; // Array to store ID of all members on the server

let guilds = {}; // Stores the bot guilds info
let channels = {};

let started = new Date();
let connectedSince = null;

let ready = false;
let booted = false;

let membersOnServer = 0;
let membersPlaying = 0;

module.exports = {
    getReady: function() {
        if (!guilds[config.get('general.server')] || guilds[config.get('general.server')].available === false) { ready = false; }
        return ready;
    },
    getBooted: function() {
        return booted;
    },

    markAsReady: function() {
        ready = true;
        logger.info(TAG, 'Server was marked as ready!');
    },
    markAsNotReady: function() {
        ready = false;
        logger.info(TAG, 'Server was marked as unready!');
    },
    markBooted: function() {
        booted = true;
        logger.info(TAG, 'Server boot marked as complete!');
    },

    // Guild stuff
    getGuild: function(id) {
        if (id === undefined) { id = config.get('general.server'); }
        if (guilds[id] === undefined) {
            logger.warning(TAG, 'Guild "' + id + '" doesn\'t exist!');
            return null;
        }
        return guilds[id];
    },
    getAllGuilds: function() {
        if (Object.keys(guilds).length === 0) {
            logger.warning(TAG, 'Guilds were requested and was empty!');
            return null;
        }
        return guilds;
    },

    // You HAVE to pass bot.guilds.get(config.get('general.server')) as for some reason it
    // won't save with just the server object
    saveGuild: function(id, guild) {
        if (guilds[id] !== undefined) {
            logger.info(TAG, `Stored server: ${guild.name}`);
        } else {
            logger.info(TAG, `Updated server: ${guild.name}`);
        }
        guilds[id] = guild;
    },
    wipeGuild: function(id) {
        if (!guilds[id]) {return;}
        logger.debug(TAG, 'Wiped guild: "' + guilds[id].name + '"');
        delete guilds[id];
    },
    wipeAllGuilds: function() {
        guilds = {};
        logger.warning(TAG, 'WIPED ALL GUILDS!');
    },

    // Channel stuff
    getChannel: function(id) {
        if (channels[id]) {
            return channels[id];
        }
        logger.warning(TAG, 'Channel "' + id + '" doesn\'t exist!');
        return null;
    },
    getChannelInGuild: function(id, guildID) {
        if (!guilds[guildID]) {return null;}
        if (guilds[guildID].channels.has(id)) {
            return guilds[guildID].channels.get(id);
        } else {
            return null;
        }
    },
    setChannel: function(id, channel) {
        if (channels[id] !== undefined) {
            logger.warning(TAG, 'Channel ' + channel.name + ' has been reassigned!');
        }
        channels[id] = channel;
        logger.info(TAG, 'Channel ' + channel.name + ' was set');
    },
    wipeChannel: function(id) {
        delete channels[id];
        logger.warning(TAG, 'Channel ' + id + ' was wiped!');
    },
    wipeChannels: function() {
        channels = {};
        logger.warning(TAG, 'Channel data was wiped!');
    },

    saveUser: function(id) {
        crashHandler.logEvent(TAG, 'saveUser');
        users.push(id);
    },

    userList: function() {
        return users;
    },

    // Helper functions to cut down length of code
    getRole: function(id) {
        if (!this.getRoles().has(id)) {
            logger.warning(TAG, 'Role ' + id + ' does not exist!');
            return null;
        }
        return this.getRoles().get(id);
    },
    getRoles: function(guild) {
        if (guild === undefined) {
            guild = config.get('general.server');
        }
        if (this.getGuild(guild).roles.array().length === 0) {
            logger.warning(TAG, 'Guild roles list is somehow empty!');
            return null;
        }
        return this.getGuild(guild).roles;
    },
    getRoleList: function(guild) {
        if (guild === undefined) {
            guild = config.get('general.server');
        }
        if (this.getRoles().members.array().length === 0) {
            logger.warning(TAG, 'Guild roles list is somehow empty!');
            return null;
        }
        return this.getRoles().members.array();
    },

    setConnectedSince: function() {
        connectedSince = new Date();
        logger.info(TAG, 'Set connection time');
    },
    getConnectedSince: function() {
        return connectedSince;
    },

    setMembersOnServer: function(guild, change) {
        crashHandler.logEvent(TAG, 'setMembersOnServer');
        /* Use memberCount on ready as non cached members can't be found, after ready count
        members in and out */
        // Note: This will count bots as members.
        if (!isNaN(change) && change !== 0) {
            membersOnServer += change;
            logger.info(TAG, `Detected change. New count: ${membersOnServer}`);
        } else {
            membersOnServer = guild.memberCount;
        }
        this.setMembersPlaying();
    },
    setMembersPlaying: function() {
        crashHandler.logEvent(TAG, 'setMembersPlaying');
        /* Check the most up to date server object we have available and scan for number of
        people playing games */

        // Ensure we get a most up to date version of the object
        let members = this.getGuild(config.get('general.server')).members.array();
        let count = 0;
        for (let x in members) {
            if (members[x].presence.game !== null && members[x].user.bot !== true) {
                count++;
            }
        }

        membersPlaying = count;
        logger.info(TAG, `Detected members playing change. New count: ${membersPlaying}`);
    },
    getMembersOnServer: function() {
        return membersOnServer;
    },
    getMembersPlaying: function() {
        return membersPlaying;
    }
};
