//  Copyright © 2018 DIG Development team. All rights reserved.

'use strict';

// Module to store server data

const config = require('config');
const crashHandler = require('../crash-handling.js');
const logger = require('../logger.js');

const TAG = 'server';
const users = []; // Array to store ID of all members on the server

let guilds = {}; // Stores the bot guilds info
let channels = {};

let connectedSince = null;

let ready = false;
let booted = false;

let membersOnServer = 0;
let membersPlaying = 0;

module.exports = {
    getReady() {
        if (!guilds[config.get('general.server')]
            || guilds[config.get('general.server')].available === false) { ready = false; }
        return ready;
    },
    getBooted() {
        return booted;
    },

    markAsReady() {
        ready = true;
        logger.info(TAG, 'Server was marked as ready!');
    },
    markAsNotReady() {
        ready = false;
        logger.info(TAG, 'Server was marked as unready!');
    },
    markBooted() {
        booted = true;
        logger.info(TAG, 'Server boot marked as complete!');
    },

    // Guild stuff
    getGuild(id) {
        let guildId;
        if (id === undefined) {
            guildId = config.get('general.server');
        } else {
            guildId = id;
        }
        if (guilds[guildId] === undefined) {
            logger.warning(TAG, `Guild "${guildId}" doesn't exist!`);
            return null;
        }
        return guilds[guildId];
    },
    getAllGuilds() {
        if (Object.keys(guilds).length === 0) {
            logger.warning(TAG, 'Guilds were requested and was empty!');
            return null;
        }
        return guilds;
    },

    // You HAVE to pass bot.guilds.get(config.get('general.server')) as for some reason it
    // won't save with just the server object
    saveGuild(id, guild) {
        if (guilds[id] !== undefined) {
            logger.info(TAG, `Stored server: ${guild.name}`);
        } else {
            logger.info(TAG, `Updated server: ${guild.name}`);
        }
        guilds[id] = guild;
    },
    wipeGuild(id) {
        if (!guilds[id]) { return; }
        logger.debug(TAG, `Wiped guild: "${guilds[id].name}"`);
        delete guilds[id];
    },
    wipeAllGuilds() {
        guilds = {};
        logger.warning(TAG, 'WIPED ALL GUILDS!');
    },

    // Channel stuff
    getChannel(id) {
        if (channels[id]) {
            return channels[id];
        }
        logger.warning(TAG, `Channel "${id}" doesn't exist!`);
        return null;
    },
    getChannelInGuild(id, guildID) {
        if (!guilds[guildID]) { return null; }
        if (guilds[guildID].channels.has(id)) {
            return guilds[guildID].channels.get(id);
        }
        return null;
    },
    setChannel(id, channel) {
        if (channels[id] !== undefined) {
            logger.warning(TAG, `Channel ${channel.name} has been reassigned!`);
        }
        channels[id] = channel;
        logger.info(TAG, `Channel ${channel.name} was set`);
    },
    wipeChannel(id) {
        delete channels[id];
        logger.warning(TAG, `Channel ${id} was wiped!`);
    },
    wipeChannels() {
        channels = {};
        logger.warning(TAG, 'Channel data was wiped!');
    },

    saveUser(id) {
        crashHandler.logEvent(TAG, 'saveUser');
        users.push(id);
    },

    userList() {
        return users;
    },

    // Helper functions to cut down length of code
    getRole(id) {
        if (!this.getRoles().has(id)) {
            logger.warning(TAG, `Role ${id} does not exist!`);
            return null;
        }
        return this.getRoles().get(id);
    },
    getRoles(guild) {
        let server;
        if (guild === undefined) {
            server = config.get('general.server');
        } else {
            server = guild;
        }
        if (this.getGuild(server).roles.array().length === 0) {
            logger.warning(TAG, 'Guild roles list is somehow empty!');
            return null;
        }
        return this.getGuild(server).roles;
    },
    getRoleList() {
        if (this.getRoles().members.array().length === 0) {
            logger.warning(TAG, 'Guild roles list is somehow empty!');
            return null;
        }
        return this.getRoles().members.array();
    },

    setConnectedSince() {
        connectedSince = new Date();
        logger.info(TAG, 'Set connection time');
    },
    getConnectedSince() {
        return connectedSince;
    },

    setMembersOnServer(guild, change) {
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
    setMembersPlaying() {
        crashHandler.logEvent(TAG, 'setMembersPlaying');
        /* Check the most up to date server object we have available and scan for number of
        people playing games */

        // Ensure we get a most up to date version of the object
        const members = this.getGuild(config.get('general.server')).members.array();
        let count = 0;
        for (const x in members) {
            if (members[x].presence.game !== null && members[x].user.bot !== true) {
                count += 1;
            }
        }

        membersPlaying = count;
        logger.info(TAG, `Detected members playing change. New count: ${membersPlaying}`);
    },
    getMembersOnServer() {
        return membersOnServer;
    },
    getMembersPlaying() {
        return membersPlaying;
    },
};
