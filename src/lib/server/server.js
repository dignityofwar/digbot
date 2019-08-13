//  Copyright © 2018 DIG Development team. All rights reserved.

// Module to store server data
// TODO: This module should be deprecated

const { Collection } = require('discord.js');
const config = require('config');

// TODO: Workaround, client should be injected. Only here for legacy support.
const client = () => require('../../bootstrap').resolve('discordjsClient'); // eslint-disable-line global-require

module.exports = {
    getReady() {
        // Websocket connection being weird, should only use the catch statement when the client was never logged in
        try {
            return client().status === 0;
        } catch (e) {
            return false;
        }
    },

    getGuild(id) {
        return client()
            .guilds
            .get(id || config.get('general.server'));
    },

    getChannel(id) {
        return client()
            .channels
            .get(
                config.has(`channels.mappings.${id}`)
                    ? config.get(`channels.mappings.${id}`)
                    : id,
            );
    },

    getChannelInGuild(id, guildID) {
        // TODO: Investigate if this function is needed
        const channel = this.getChannel(id);
        return channel.guild.id === guildID ? channel : null;
    },

    getRole(id) {
        return this.getRoles()
            .get(id);
    },

    getRoles(guildId) {
        const guild = this.getGuild(guildId);
        return guild ? guild.roles : new Collection();
    },
};
