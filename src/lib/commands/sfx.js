//  Copyright © 2018 DIG Development team. All rights reserved.

'use strict';

// !sfx module, plays short audio clips in the user's channel

const config = require('config');
const crashHandler = require('../crash-handling.js');
const google = require('googleapis');
const logger = require('../logger.js');
const server = require('../server/server.js');
const sfx = require('../../assets/sfx/sfx-assets.js');
const yt = require('ytdl-core');

const TAG = '!sfx';
const youtubeKey = config.get('youtubeKey'); // youtube API key
const youtube = google.youtube('v3'); // create youtube API client
let busy = false;
let failing = false;
const queue = [];
const verification = {};

module.exports = {
    execute(msg) {
        if (!config.get('features.sfx')) {
            sendMessageToChannel(msg.channel, 'Sorry this feature has been disabled');
            return false;
        }

        if (msg.content.length === 4 || msg.content.substring(5) === ' ') {
            sendMessageToChannel(msg.channel, 'Please provide an sfx to play. E.g. !sfx cena');
            return false;
        }

        if (msg.content.substring(5) === 'list') {
            sendMessageToChannel(msg.channel, list(msg));
            return false;
        }
        if (typeof sfx[msg.content.substring(5)] === 'undefined') {
            sendMessageToChannel(msg.channel, 'Sorry I don\'t recognise that sound effect');
            return false;
        }
        if (!msg.member.voiceChannel) {
            sendMessageToChannel(msg.channel, 'Please be in a voice channel first!');
            return false;
        }
        if (busy) {
            sendMessageToChannel(msg.channel, `Added !sfx effect *${msg.content.substring(5)}* `
                + `to play queue for ${msg.member.displayName}, queue length: ${queue.length}`, true)
                .then((botMessage) => {
                    queueAdd(msg, botMessage);
                })
                .catch(() => {
                    crashHandler.logEvent(TAG, 'Queue failed to add due to failed promise (busy)');
                    sendMessageToChannel(msg.channel, 'Sorry, the sfx encountered an error, please try again.');
                });
            return true;
        }
        sendMessageToChannel(msg.channel, `Playing effect: *${msg.content.substring(5)}* for `
            + `${msg.member.displayName}`, true)
            .then((botMessage) => {
                queueAdd(msg, botMessage);
                play();
            })
            .catch(() => {
                crashHandler.logEvent(TAG, 'Queue failed to add due to failed promise');
                sendMessageToChannel(msg.channel, 'Sorry, the sfx encountered an error, please try again.');
            });
        return true;
    },

    // Called on ready and then every 24 hours, verifies all sfx on file are good links
    ready() {
        if (!config.get('features.sfx')) { return false; }
        for (const x in sfx) {
            if (sfx[x].source === 'youtube') {
                verify(sfx[x].link, x);
            }
        }
        return true;
    },
};

// Send the user a list of all available sound effects
function list(msg) {
    let message = '__Full list of available sound effects__: ';
    for (const effect in sfx) {
        message += `\n!sfx ${effect} - ${sfx[effect].description}`;
    }
    if (message.length < 2000) {
        msg.author.sendMessage(message)
            .then(() => {
                logger.debug(TAG, 'Succesfully sent message');
            })
            .catch((err) => {
                logger.warning(TAG, `Failed to send message error: ${err}`);
            });
        return `I'll PM you the full list of sound effects ${msg.member.displayName}`;
    }
    logger.warning(TAG, 'You fools, you damned fools, !sfx list message is over 2k in characters '
        + 'and needs to be refactored');
    return 'Sorry this command is temporarily broken we\'ve got top men working on it right now.';
}

// Called when there is a verified sfx to be played, all info required is passed via the queue
function play() {
    crashHandler.logEvent(TAG, 'play');
    if (server.getReady() === false) {
        logger.debug(TAG, 'Server not ready, setting play on timeout');
        setTimeout(() => {
            logger.debug(TAG, 'Calling play again');
            this.play();
        }, 10000);
        return false;
    }
    if (queue.length > 1) {
        logger.info(TAG, `Play called, ${(queue.length - 1)} more in queue`);
    }
    busy = true;
    setTimeout(release, 30000); // Reset busy status after 30 seconds
    logger.info(TAG, `${queue[0].user} called the ${queue[0].effect} effect for the channel `
        + `${queue[0].channelName} with ${queue[0].channelSize} occupants`);

    // If sfx is local file
    if (sfx[queue[0].effect].source === 'local') {
        const file = config.get('general.root') + sfx[queue[0].effect].path;
        const options = sfx[queue[0].effect].options;
        queue[0].voiceChannel.join()
            .then((connection) => {
                crashHandler.logEvent(TAG, 'Bot Connected to channel');
                logger.debug(TAG, `Connected to channel: ${queue[0].channelName}`);
                connection.on('disconnect', () => {
                    crashHandler.logEvent(TAG, 'Bot Disconnected from channel');
                    logger.debug(TAG, `Disconected from channel: ${queue[0].channelName}`);
                    queue[0].botMessage.delete()
                        .then(() => {
                            logger.info(TAG, 'Succesfully finished playing and deleted message');
                        })
                        .catch((err) => {
                            logger.warning(TAG, `Failed to delete message after playing, ${err}`);
                        });
                    if (failSafe) { clearTimeout(failSafe); }
                    failing = false;
                    playEnd(true);
                });
                connection.on('error', (err) => {
                    logger.warning(TAG, `Error from connection: ${err}`);
                });
                const dispatcher = connection.playFile(file, options);
                dispatcher.on('end', () => {
                    queue[0].voiceChannel.leave();
                    queue[0].botMessage.delete()
                        .then(() => {
                            logger.info(TAG, 'Succesfully finished playing and deleted message');
                        })
                        .catch((err) => {
                            logger.warning(TAG, `Failed to delete message after playing, ${err}`);
                        });
                });
                dispatcher.on('start', () => {
                    crashHandler.logEvent(TAG, 'Bot started playing');
                    logger.info(TAG, `Started playing: ${queue[0].effect} in ${queue[0].channelName}`);
                });
                dispatcher.on('error', (err) => {
                    queue[0].textChannel.sendMessage('Error during playback, please try again');
                    logger.debug(TAG, `Error while playing ${queue[0].effect} effect: ${err}`);
                });
            })
            .catch((err) => {
                if (failing === false) {
                    crashHandler.logEvent(TAG, 'Bot unable to connect to channel');
                    queue[0].textChannel.sendMessage('Error establishing connection, re-trying...')
                        .then(() => {
                            logger.debug(TAG, 'Succesfully sent message');
                        })
                        .catch((error) => {
                            logger.warning(TAG, `Failed to send message error: ${error}`);
                        });
                    failing = 0;
                }
                failing += 1;
                logger.warning(TAG, `voiceChannel.join promise rejected, error: ${err}`);
                queue[0].voiceChannel.leave();
                playEnd(false);
            });
        return true;
    }

    // If sfx is youtube link
    if (sfx[queue[0].effect].source === 'youtube') {
        const source = sfx[queue[0].effect].link;

        // Verify source is good
        if (verification[queue[0].effect] !== true) {
            queue[0].textChannel.sendMessage(`The SFX *${queue[0].effect}* is currently `
                + 'unavailable, please try a different SFX')
                .then(() => {
                    logger.debug(TAG, 'Succesfully sent message regarding source');
                })
                .catch((err) => {
                    logger.warning(TAG, `Failed to send message regarding source error: ${err}`);
                });
            playEnd(true);
            return false;
        }

        const stream = yt(source, { audioonly: true });
        const options = sfx[queue[0].effect].options;
        queue[0].voiceChannel.join()
            .then((connection) => {
                crashHandler.logEvent(TAG, `Bot joined channel: ${queue[0].channelName}`);
                connection.on('disconnect', () => {
                    crashHandler.logEvent(TAG, `Bot disconnected from channel: ${queue[0].channelName}`);
                    queue[0].botMessage.delete()
                        .then(() => {
                            logger.info(TAG, 'Succesfully finished playing and deleted message');
                        })
                        .catch((err) => {
                            logger.warning(TAG, `Failed to delete message after playing, ${err}`);
                        });
                    if (failSafe) { clearTimeout(failSafe); }
                    failing = false;
                    playEnd(true);
                });
                connection.on('error', (err) => {
                    crashHandler.logEvent(TAG, `Bot connection error to channel: ${queue[0].channelName}`);
                    queue[0].textChannel.sendMessage('Error with connection, please try again')
                        .then(() => {
                            logger.debug(TAG, 'Succesfully sent message');
                        })
                        .catch((error) => {
                            logger.warning(TAG, `Failed to send message error: ${error}`);
                        });
                    logger.warning(TAG, `Error from connection: ${err}`);
                });
                const dispatcher = connection.playStream(stream, options);
                dispatcher.on('end', () => {
                    queue[0].voiceChannel.leave();
                    crashHandler.logEvent(TAG, `Bot left channel: ${queue[0].channelName}`);
                });
                dispatcher.on('start', () => {
                    crashHandler.logEvent(TAG, `Bot started playing: ${queue[0].effect} in `
                    + `${queue[0].channelName}`);
                });
                dispatcher.on('error', (err) => {
                    crashHandler.logEvent(TAG, `Bot playback error: ${err} in `
                        + `${queue[0].channelName} effect: ${queue[0].effect}`);
                    queue[0].textChannel.sendMessage('Error during playback, please try again')
                        .then(() => {
                            logger.debug(TAG, 'Succesfully sent message');
                        })
                        .catch((error) => {
                            logger.warning(TAG, `Failed to send message error: ${error}`);
                        });
                });
            })
            .catch((err) => {
                crashHandler.logEvent(TAG, 'Bot unable to connect to channel');
                if (failing === false) {
                    queue[0].textChannel.sendMessage('Error establishing connection, re-trying...')
                        .then(() => {
                            logger.debug(TAG, 'Succesfully sent message');
                        })
                        .catch((error) => {
                            logger.warning(TAG, `Failed to send message error: ${error}`);
                        });
                    failing = 0;
                }
                failing += 1;
                logger.warning(TAG, `voiceChannel.join promise rejected, error: ${err}`);
                queue[0].voiceChannel.leave();
                playEnd(false);
            });
        return true;
    }

    return false;
}

// Called when the bot DCs from a voicechannel
function playEnd(success) {
    if (success !== false || failing === 3) {
        queue.splice(0, 1);
    }
    if (queue.length !== 0) {
        setTimeout(play, 1500); // Don't remove, needed to prevent fail cascade
    } else {
        busy = false;
    }
    if (failing > 3) {
        logger.error(TAG, 'Fail cascade detected, restarting...');
    }
}

// Failsafe function called after 30s timeout, reset busy status and leave channel to play next in queue
function release() {
    crashHandler.logEvent(TAG, 'release');
    queue[0].voiceChannel.leave();
    logger.warning(TAG, 'SFX play timed out');
}

// Function to send messages to channels, optional promise functionality to get the new message back
function sendMessageToChannel(channel, message, promise) {
    if (promise === true) {
        return new Promise((resolve, reject) => {
            channel.sendMessage(message)
                .then((botMessage) => {
                    logger.debug(TAG, `Succesfully sent message: ${message}`);
                    resolve(botMessage);
                })
                .catch((err) => {
                    logger.warning(TAG, `Failed to send message to channel, ${err}`);
                    reject(err);
                });
        });
    }
    channel.sendMessage(message)
        .then(() => {
            logger.debug(TAG, `Succesfully sent message: ${message}`);
        })
        .catch((err) => {
            logger.warning(TAG, `Failed to send message to channel, ${err}`);
        });
    return false;
}

// Construct the object to store in the queue
function queueAdd(msg, botMessage) {
    const messageObject = {};
    messageObject.voiceChannel = msg.member.voiceChannel;
    messageObject.channelName = msg.channel.name;
    messageObject.channelSize = msg.member.voiceChannel.members.size;
    messageObject.effect = msg.content.substring(5);
    messageObject.user = msg.member.displayName;
    messageObject.textChannel = msg.channel;
    messageObject.botMessage = botMessage;
    queue.push(messageObject);
    msg.delete()
            .then(() => {
                logger.debug(TAG, `Recieved and Succesfully deleted command: ${msg.content}`);
            })
            .catch((err) => {
                logger.warning(TAG, `Failed to delete !sfx command message: ${msg.content} `
                    + `from ${msg.member.displayName}, ${err}`);
            });
}

function verify(source, name) {
    let verifySource = source;
    if (source.indexOf('?v=') !== -1) {
        verifySource = verifySource.substring((verifySource.indexOf('?v=') + 3));
    }
    const params = {
        key: youtubeKey,
        part: 'snippet',
        id: verifySource,
    };
    youtube.videos.list(params, (err, response) => {
        if (err) {
            verification[name] = false;
        } else if (response.pageInfo.totalResults === 0) {
            logger.warning(TAG, `Verification process indicates sfx asset: *${name}* is bad`);
            verification[name] = false;
        } else {
            verification[name] = true;
        }
    });
}
