//  Copyright © 2018 DIG Development team. All rights reserved.

/* eslint prefer-promise-reject-errors: off */

// Module to control sub bot usage, logs in bots as required

const _ = require('lodash');
const config = require('config');
const Discord = require('discord.js');

const logger = require('../logger');
const server = require('../server/server.js');

const TAG = 'subBots';

let currentBots = 0; // Current bots running, note: not an accurate indication of bots available
let subBots = null;
let retrying = false;

module.exports = {
    // Logs out a sub bot, after it is no longer needed
    logout(bot) {
        logger.event(TAG, 'logout');
        currentBots -= 1;
        bot.destroy()
            .then(() => {
                logger.info(TAG, `Succesfully logged out sub bot: ${bot.user.id}`);
                for (const x in subBots) {
                    if (subBots[x].id === bot.user.id) {
                        subBots[x].busy = false;
                    }
                }
            })
            .catch(() => {
                logger.warning(TAG, `Sub bot ${bot.user.id}failed to log out, marking as busy for `
                    + '25 hours');
                setTimeout(() => {
                    logger.event(TAG, 'release setTimeout in logout()');
                    for (const x in subBots) {
                        if (subBots[x].id === bot.user.id) {
                            subBots[x].busy = false;
                        }
                    }
                    retryReady();
                }, 90000000);
            });
        return true;
    },

    // Logs in a sub bot that isn't currently busy and passes it back
    passBot() {
        logger.event(TAG, 'passBot');
        return new Promise((resolve, reject) => {
            if (currentBots >= config.get('subBotLimit')) {
                logger.info(TAG, 'SubBot requested but maximum number logged on');
                reject('The maximum number of subBots are currently running');
                return;
            }

            // Probably best not to hit this, should be checked by what's calling it for better handling
            if (!Object.keys(config.get('subBots')).length) {
                logger.info(TAG, 'SubBots feature called, but disabled or no subBots on file, rejecting');
                reject('The sub bot feature is disabled or there are no subBots on file');
                return;
            }

            let token = null;
            for (const x in subBots) {
                if (subBots[x].busy !== true && subBots[x].booted) {
                    subBots[x].busy = true;
                    ({ token } = subBots[x]);
                    break;
                }
            }
            if (token === null) {
                logger.devAlert(TAG, 'Recieved request for sub bot but all sub bots are busy!');
                reject('All sub bots are currently busy');
                return;
            }

            currentBots += 1;

            const bot = new Discord.Client();
            bot.login(token)
                .then(() => {
                    logger.debug(TAG, `Succesfully logged in sub bot: ${bot.user.id}`);
                    resolve(bot);
                })
                .catch((err) => {
                    logger.warning(TAG, `Failed to log in sub bot, ${err}`);
                    reject('The sub bot failed to log in');
                });
        });
    },

    // Logs in all bots, should be done on ready and every 24 hours to keep them active
    ready() {
        logger.event(TAG, 'ready');
        if (!Object.keys(config.get('subBots')).length) {
            logger.info(TAG, 'SubBots feature disabled or no subBots on file');
            return false;
        }

        if (subBots === null) {
            subBots = _.mapValues(
                config.get('subBots'),
                subBot => ({
                    booted: false,
                    busy: false,
                    ...subBot,
                }),
            );
        }

        for (const x in subBots) {
            if (subBots[x].booted === true && subBots[x].busy) {
                logger.info(TAG, `Sub bot ${subBots[x].id} marked as busy, skipping`);
            }
            subBots[x].busy = true;
            const bot = new Discord.Client();
            bot.login(subBots[x].token)
                .then(() => { // eslint-disable-line no-loop-func
                    logger.debug(TAG, 'Sub bot login succesful');
                    if (server.getGuild().members.get(bot.user.id).voiceChannel) {
                        logger.info(TAG, `Identified sub bot ${bot.user.id} was in a voice channel, `
                            + 'attempting to leave');
                        bot.channels.get(server.getGuild().members.get(bot.user.id).voiceChannel.id).leave();
                        setTimeout(() => {
                            logger.event(TAG, '.then setTimeout in ready()');
                            bot.destroy()
                                .then(() => {
                                    logger.debug(TAG, `Successfully logged out sub bot: ${subBots[x].id}`);
                                    subBots[x].busy = false;
                                    subBots[x].booted = true;
                                })
                                .catch(() => {
                                    logger.warning(TAG, `Failed to log out sub bot: ${subBots[x].id}`);
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
                                logger.warning(TAG, `Failed to log out sub bot: ${subBots[x].id}`);
                                retryReady();
                            });
                        subBots[x].busy = false;
                    }
                })
                .catch((err) => {
                    retryReady();
                    logger.warning(TAG, `Error on sub bot login: ${err}`);
                });

            bot.on('ready', () => {
                if (config.util.getEnv('NODE_ENV') !== 'production') {
                    bot.channels.get(config.get('channels.mappings.digbot'))
                        .send('Sub bot reporting for duty')
                        .then(() => {
                            logger.debug(TAG, 'Sub bot succesfully sent message');
                        })
                        .catch((err) => {
                            logger.warning(TAG, `Sub bot failed to send message, ${err}`);
                        });
                }
            });
        }
        return true;
    },
};

// If a bot fails to log in and out on ready, try to succesfully cycle the bots again
function retryReady() {
    logger.event(TAG, 'retryReady');
    if (retrying) { return false; }
    retrying = true;
    logger.info(TAG, 'Ready function failed, retrying...');
    setTimeout(() => {
        logger.event(TAG, 'setTimeout in retryReady()');
        retrying = false;
        module.exports.ready();
    }, 300000);
    return true;
}
