//  Copyright © 2018 DIG Development team. All rights reserved.

'use strict';

const envConfig = require('./envConfig.js');

const environment = envConfig.environment;

const channels = require(`./${environment}/channels.js`);
const communityGames = require(`./${environment}/communityGames.js`);
const features = require(`./${environment}/features.js`);
const generalConfig = require(`./${environment}/generalConfig.js`);
const recreationalGames = require(`./${environment}/recreationalGames.js`);

let config = {
    // User configs
    channels: channels.channelMappings,
    showPerfStats: envConfig.showPerfStats || false,
    subBots: envConfig.subBots || false, // Sub bots object
    token: envConfig.token, // Bot token
    youtubeKey: envConfig.youtubeKey || false, // Your youtube API key

    // General Configs
    botUserID: envConfig.botUserID || generalConfig.botUserID, // Allow botUserID to override for CI
    environment: environment,
    general: generalConfig,
    streamChannel: channels.mappings.streams, // channel ID for stream links
    testing: false, // If the bot is being tested (avoid using when possible to not comprimise validity)

    // Quantity Configs
    antispamCommandTick: 300000, // 5 mins
    antispamCommandLimitCats: 2, // Limit on cats command
    antispamUserTick: 120000, // 2 mins
    antispamUserLimit: 10, // Commands before antispam shuts someone down
    autoDeleteChannels: 1200000, // How often autodelete.js checks for deletable channels
    eventProtection: 900000, // Length of time channels are protected for after an event ends
    inactivityLimit: 30, //Number of days of innactivity after which a member is pruned
    memberMentionLimit: 20, // Number we allow people to mention members a day
    mentionsMuteTime: 7200000, // Time to supermute someone spamming mentions
    roleMentionLimit: 5, // Number of times we allow people to mention roles a day
    subBotLimit: 5, // Maximum number of sub bots allowed to run concurrently
    textInactive: 7200000, // Length of time after which a text channel is considered inactive

    channels: channels,
    communityGames: communityGames,
    features: features,
    logger: {
        debug: new Set(['webhook', 'antispam']) // List of module names printing debug messages
    },
    recreationalGames: recreationalGames
};

module.exports = {
    getConfig: function() {
        return config;
    },

    setConfig: function(newConfig) {
        if (newConfig !== undefined) {
            config = newConfig;
            return true;
        } else {
            return false;
        }
    },

    setProperty: function(property, value) {
        if (property !== undefined && value !== undefined) {
            config[property] = value;
            return true;
        } else {
            return false;
        }
    }
};
