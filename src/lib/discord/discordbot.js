//  Copyright © 2018 DIG Development team. All rights reserved.

'use strict';

// Primary bot module, handles all bot events

const config = require('config');
const crashHandler = require('../crash-handling.js');
const Discord = require('discord.js');
const logger = require('../logger.js');
const performance = require('../tools/performance.js');
const serverEvents = require('./bot-events.js');

const TAG = 'discordbot';

let bot = null;
let restarting = false; // Don't overload requests, for if load time exceeds retry interval

/* Timer to check the connection status and attempt a reconnect if not ready, only needed for startup
after which the bot's own reconnect functionality should take over */
let startClock = setInterval(restart, 3000);
let restartClock = null; // Global var for a backup incase the bot's reconnect functionality breaks
setInterval(() => {
    performance.execute();
}, 30000);

performance.ready();

module.exports = {
    init: initBot,
    injectMessage: msg => bot.emit('message', msg),
};

function initBot(done) {
    crashHandler.logEvent(TAG, 'initBot');
    restarting = true;
    setStartClock();
    // If bot is already set, kill it
    bot = new Discord.Client();
    logger.info(TAG, 'DIGBot, starting up.');
    if (done !== undefined) {
        bot.on('ready', done);
    }
    bot.login(config.get('token'))
        .then(() => {
            clearStartClock(); // Make sure more login attempts aren't sent
            clearRestartClock();
            restarting = false;
            crashHandler.logEvent(TAG, 'login');
        })
        .catch((err) => {
            restarting = false;
            logger.warning(TAG, `Error on bot login: ${err}`);
        });

    // When a channel is created
    bot.on('channelCreate', (channel) => {
        crashHandler.logEvent(TAG, 'channelCreate');
        serverEvents.channelCreate(channel, bot);
    });

    // Emitted whenever a channel is deleted
    bot.on('channelDelete', (channel) => {
        crashHandler.logEvent(TAG, 'channelDelete');
        serverEvents.channelDelete(channel, bot);
    });

    // Emitted whenever a channel is updated, Ex: Description, name
    bot.on('channelUpdate', (oldChannel, newChannel) => {
        crashHandler.logEvent(TAG, 'channelUpdate');
        serverEvents.channelUpdate(oldChannel, newChannel, bot);
    });

    // Emitted for general debugging information
    bot.on('debug', (info) => {
        if (config.util.getEnv('NODE_ENV') === 'development') {
            crashHandler.logEvent(TAG, 'debug');
            serverEvents.debug(info);
        }
    });

    // On webscocket disconnect
    bot.on('disconnect', () => {
        crashHandler.logEvent(TAG, 'disconnect');
        clearRestartClock();
        serverEvents.disconnectEvent();
        setRestartClock();
    });

    // Emitted whenever the bot joins a guild.
    bot.on('guildCreate', (guild) => {
        crashHandler.logEvent(TAG, 'guildCreate');
        serverEvents.guildCreate(guild, bot);
    });

    // Emitted whenever a bot leaves a guild or a guild is deleted.
    bot.on('guildDelete', (guild) => {
        crashHandler.logEvent(TAG, 'guildDelete');
        serverEvents.guildDelete(guild);
    });

    // Send welcome message DM to new arrivals
    bot.on('guildMemberAdd', (mem) => {
        crashHandler.logEvent(TAG, 'guildMemberAdd');
        serverEvents.guildMemberAdd(mem, bot);
    });

    // Emitted whenever a member leaves a guild
    bot.on('guildMemberRemove', (member) => {
        crashHandler.logEvent(TAG, 'guildMemberRemove');
        serverEvents.guildMemberRemove(member, bot);
    });

    // Emitted whenever a Guild Member changes - i.e. new role, removed role, nickname
    bot.on('guildMemberUpdate', (oldMember, newMember) => {
        crashHandler.logEvent(TAG, 'guildMemberUpdate');
        serverEvents.guildMemberUpdate(oldMember, newMember);
    });

    // Emitted whenever a member leaves a guild
    bot.on('guildUpdate', (oldGuild, newGuild) => {
        crashHandler.logEvent(TAG, 'guildUpdate');
        serverEvents.guildUpdate(oldGuild, newGuild, bot);
    });

    // Whenever the bot recieves a message from the websocket
    bot.on('message', (msg) => {
        crashHandler.logEvent(TAG, 'message');
        serverEvents.message(msg, bot);
    });

    // Whenever a message that the bot can see is updated (edits, embeds, etc.)
    bot.on('messageUpdate', (oldMessage, newMessage) => {
        crashHandler.logEvent(TAG, 'messageUpdate');
        serverEvents.messageUpdate(oldMessage, newMessage);
    });

    // When a user starts playing a game, check if they have the relevent roles
    bot.on('presenceUpdate', (oldMember, newMember) => {
        crashHandler.logEvent(TAG, 'presenceUpdate');
        serverEvents.presenceUpdate(oldMember, newMember);
    });

    // Emitted when the bot client is ready
    bot.on('ready', () => {
        crashHandler.logEvent(TAG, 'ready');
        clearRestartClock();
        serverEvents.ready(bot);
    });

    // On reconnect attempts
    bot.on('reconnecting', () => {
        crashHandler.logEvent(TAG, 'reconnecting');
        clearRestartClock();
        serverEvents.reconnecting();
        setRestartClock();
    });

    // On the creation of a role
    bot.on('roleCreate', (role) => {
        crashHandler.logEvent(TAG, 'roleCreate');
        serverEvents.roleCreate(role, bot);
    });

    // On the deletion of a role
    bot.on('roleDelete', (role) => {
        crashHandler.logEvent(TAG, 'roleDelete');
        serverEvents.roleDelete(role, bot);
    });

    // On the update of a role, i.e. perms, ordering etc.
    bot.on('roleUpdate', (oldRole, newRole) => {
        crashHandler.logEvent(TAG, 'roleUpdate');
        serverEvents.roleUpdate(oldRole, newRole, bot);
    });

    // Emitted whenever a user changes voice state - e.g. joins/leaves a channel, mutes/unmutes.
    bot.on('voiceStateUpdate', (oldMember, newMember) => {
        crashHandler.logEvent(TAG, 'voiceStateUpdate');
        serverEvents.voiceStateUpdate(oldMember, newMember);
    });

    // Emitted for general warnings
    bot.on('warn', (warning) => {
        crashHandler.logEvent(TAG, 'warn');
        serverEvents.warning(warning);
    });
}

function clearRestartClock() {
    if (restartClock) {
        logger.debug(TAG, 'Restart clock wiped');
        clearTimeout(restartClock);
        restartClock = null;
    }
}

function clearStartClock() {
    if (startClock) {
        logger.debug(TAG, 'Start clock wiped');
        clearInterval(startClock);
        startClock = null;
    }
}

function restart() {
    crashHandler.logEvent(TAG, 'restart');
    if (restarting) {
        logger.debug(TAG, 'Already restarting...');
        return;
    }
    logger.warning(TAG, 'Restarting bot due to connection timeout');
    restarting = true;
    if (bot.uptime === null) {
        logger.warning(TAG, 'Bot failed to connect, re-attempting connection...');
        crashHandler.logEvent(TAG, 'restart initBot');
        if (bot !== null) {
            bot = null;
            initBot();
        } else {
            initBot();
        }
    } else {
        logger.warning(TAG, 'Bot connection handling failed, destroying bot, re-attempting connection...');
        crashHandler.logEvent(TAG, 'restart bot.destroy');
        bot.destroy()
            .then(() => {
                crashHandler.logEvent(TAG, 'restart bot destroyed');
                logger.debug('Bot succesfully destroyed, restarting');
                initBot();
            })
            .catch(() => {
                // If we hit this point we're well and truly fucked
                crashHandler.logEvent(TAG, 'restart crashing');
                logger.critical(TAG, 'Bot.destroy() rejected, crashing');
                process.exit(1);
            });
    }
}

function setRestartClock() {
    if (!restartClock) {
        logger.debug(TAG, 'Restart clock started');
        restartClock = setTimeout(restart, 60000);
    }
}

function setStartClock() {
    if (!startClock) {
        logger.debug(TAG, 'Start clock started');
        startClock = setInterval(restart, 3000);
    }
}
