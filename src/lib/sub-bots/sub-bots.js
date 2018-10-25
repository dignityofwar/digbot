//  Copyright © 2018 DIG Development team. All rights reserved.

'use strict';

// Module to control sub bot usage, logs in bots as required

const _ = require('lodash');
const config = require('config');
const crashHandler = require('../crash-handling.js');
const Discord = require('discord.js');
const logger = require('../logger.js');
const server = require('../server/server.js');
const TAG = 'subBots';

let currentBots = 0; // Current bots running, note: not an accurate indication of bots available
let subBots = null;
let retrying = false;

module.exports = {
    // Logs out a sub bot, after it is no longer needed
    logout: function(bot) {
        crashHandler.logEvent(TAG, 'logout');
        currentBots--;
        bot.destroy()
            .then(() => {
                logger.info(TAG, 'Succesfully logged out sub bot: ' + bot.user.id);
                for (let x in subBots) {
                    if (subBots[x].id === bot.user.id) {
                        subBots[x].busy = false;
                    }
                }
            })
            .catch(() => {
                logger.warning(TAG, 'Sub bot ' + bot.user.id + 'failed to log out, marking as busy for ' +
                    '25 hours');
                let release = setTimeout(function() {
                    crashHandler.logEvent(TAG, 'release setTimeout in logout()');
                    subBots[x].busy = false;
                    retryReady();
                }, 90000000);
            });
        return true;
    },

    // Logs in a sub bot that isn't currently busy and passes it back
    passBot: function() {
        crashHandler.logEvent(TAG, 'passBot');
        return new Promise(function(resolve, reject) {
            // Probably best not to hit this, should be checked by what's calling it for better handling
            if (!Object.keys(config.get('subBots')).length) {
                logger.info(TAG, 'SubBots feature called, but disabled or no subBots on file, rejecting');
                reject('The sub bot feature is disabled or there are no subBots on file');
                return;
            }

            if (currentBots >= config.get('subBotLimit')) {
                logger.info(TAG, 'SubBot requested but maximum number logged on');
                reject('The maximum number of subBots are currently running');
                return;
            } else {
                currentBots++;
            }

            let token = null;
            for (let x in subBots) {
                if (subBots[x].busy !== true && subBots[x].booted) {
                    subBots[x].busy = true;
                    token = subBots[x].token;
                    break;
                }
            }
            if (token === null) {
                logger.devAlert(TAG, 'Recieved request for sub bot but all sub bots are busy!');
                reject('All sub bots are currently busy');
                return;
            }
            let bot = new Discord.Client();
            bot.login(token)
                .then(() => {
                    logger.debug(TAG, `Succesfully logged in sub bot: ${bot.user.id}`);
                    resolve(bot);
                })
                .catch(err => {
                    logger.warning(TAG, `Failed to log in sub bot, ${err}`);
                    reject('The sub bot failed to log in');
                });
        });
    },

    // Logs in all bots, should be done on ready and every 24 hours to keep them active
    ready: function() {
        crashHandler.logEvent(TAG, 'ready');
        if (!Object.keys(config.get('subBots')).length) {
            logger.info(TAG, 'SubBots feature disabled or no subBots on file');
            return false;
        }

        if (subBots === null) {
            subBots = _.mapValues(
              config.get('subBots'),
              (subBot) => Object.assign({booted: false, busy: false}, subBot)
            );
        }

        for (let x in subBots) {
            if (subBots[x].booted === true && subBots[x].busy) {
                logger.info(TAG, 'Sub bot ' + subBots[x].id + ' marked as busy, skipping');
            };
            subBots[x].busy = true;
            let bot = new Discord.Client();
            bot.login(subBots[x].token)
                .then(() => {
                    logger.debug(TAG, 'Sub bot login succesful');
                    if (server.getGuild().members.get(bot.user.id).voiceChannel) {
                        logger.info(TAG, `Identified sub bot ${bot.user.id} was in a voice channel, ` +
                            `attempting to leave`);
                        bot.channels.get(server.getGuild().members.get(bot.user.id).voiceChannel.id).leave();
                        let timer = setTimeout(function() {
                            crashHandler.logEvent(TAG, '.then setTimeout in ready()');
                            bot.destroy()
                                .then(() => {
                                    logger.debug(TAG, `Successfully logged out sub bot: ${subBots[x].id}`);
                                    subBots[x].busy = false;
                                    subBots[x].booted = true;
                                })
                                .catch(() => {
                                    logger.warning(TAG, 'Failed to log out sub bot: ' + subBots[x].id);
                                    retryReady();
                                });
                        }, 5000);
                    } else {
                        bot.destroy()
                            .then(() => {
                                logger.debug(TAG, `Successfully logged out sub bot: ${subBots[x].id}`);
                                subBots[x].busy = false;
                                subBots[x].booted = true;
                            })
                            .catch(() => {
                                logger.warning(TAG, 'Failed to log out sub bot: ' + subBots[x].id);
                                retryReady();
                            });
                        subBots[x].busy = false;
                    }
                })
                .catch(err => {
                    retryReady();
                    logger.warning(TAG, `Error on sub bot login: ${err}`);
                });

            bot.on('ready', () => {
                if (config.util.getEnv('NODE_ENV') !== 'production') {
                    bot.channels.get(config.get('channels.mappings.digbot'))
                        .sendMessage('Sub bot reporting for duty')
                        .then(
                            logger.debug(TAG, 'Sub bot succesfully sent message')
                        )
                        .catch(err => {
                            logger.warning(TAG, `Sub bot failed to send message, ${err}`);
                        });
                }
            });
        }
        return true;
    }
};

// If a bot fails to log in and out on ready, try to succesfully cycle the bots again
function retryReady() {
    crashHandler.logEvent(TAG, 'retryReady');
    if (retrying) { return false; }
    retrying = true;
    logger.info(TAG, `Ready function failed, retrying...`);
    let timer = setTimeout(function() {
        crashHandler.logEvent(TAG, 'setTimeout in retryReady()');
        retrying = false;
        module.exports.ready();
    }, 300000);
}
