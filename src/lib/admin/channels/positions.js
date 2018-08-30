//  Copyright © 2018 DIG Development team. All rights reserved.

'use strict';

// Calculates and enforces the positions that channels should hold

const config = require('../../../../config/config.js');
const crashHandler = require('../../crash-handling.js');
const logger = require('../../logger.js');
const server = require('../../server/server.js');
const TAG = 'Channel Positions';

let busy = false; // If the module is running
let positions = {};
let queue = false; // If the module needed to run again, run fresh as soon as the module's free

module.exports = {
    // Check the positioning of all channels on the server
    globalCheck: function() {
        crashHandler.logEvent(TAG, 'globalCheck');
        if (!config.getConfig().features.channelPositionsEnforcement) { return; } // Feature switch
        // Don't let this module run twice at once
        if (busy) {
            queue = true;
            logger.debug(TAG, 'Global sort busy, queuing');
            return;
        } else {
            logger.debug(TAG, 'Marking global sort as busy');
            busy = true;
        }

        if (server.getReady) {
            logger.info(TAG, 'Running global check');
            // Build the positions object to dictate the correct position of each channel
            constructPositions();

            // Ensure all channels are holding the correct positions, correct if they are not
            enforcePositions()
                .then(() => {
                    logger.info(TAG, 'Succesfuly ran global check');
                    if (queue) {
                        logger.debug(TAG, 'Releasing queue AFTER .then');
                        queueRelease();
                    } else {
                        let timer = setTimeout(function() {
                            busy = false;
                            logger.debug(TAG, 'Busy marked as false');
                        }, 3000);
                    }
                })
                .catch(() => {
                    logger.warning(TAG, 'Global check failed, retrying...');
                    queueRelease();
                });
        } else {
            // If server not ready, try again in 10 secs
            queue = true;
            let timer = setTimeout(function() {
                queueRelease();
            }, 10000);
        }
    }
};

// Build the positions object to dictate the correct position of each channel
function constructPositions() {
    crashHandler.logEvent(TAG, 'constructPositions');
    positions.text = {};
    positions.voice = {};
    indexTextChannels();
    indexVoiceChannels();
}

// If a channel is not holding its calculated correct position then move it
function enforcePositions() {
    crashHandler.logEvent(TAG, 'enforcePositions');
    return new Promise(function(resolve, reject) {
        let channels = server.getGuild().channels.array();
        let textChannels = [];
        let voiceChannels = [];
        for (let x in server.getGuild().channels.array()) {
            if (channels[x].type === 'text') {
                textChannels.push(channels[x]);
            }
            if (channels[x].type === 'voice') {
                voiceChannels.push(channels[x]);
            }
        }
        let promises = [];
        for (let x in textChannels) {
            if (positions.text[textChannels[x].position] !== textChannels[x].id) {
                for (let y in positions.text) {
                    if (positions.text[y] === textChannels[x].id) {
                        let p = requestPosition(textChannels[x], y);
                        if (p !== false) {
                            promises.push(p);
                        }
                    }
                }
            }
        }
        for (let x in voiceChannels) {
            if (positions.voice[voiceChannels[x].position] !== voiceChannels[x].id) {
                for (let y in positions.voice) {
                    if (positions.voice[y] === voiceChannels[x].id) {
                        let p = requestPosition(voiceChannels[x], y);
                        if (p !== false) {
                            promises.push(p);
                        }
                    }
                }
            }
        }
        logger.debug(TAG, `Executing ${promises.length} promises`);
        if (promises.length === 0) {
            resolve();
        } else {
            Promise.all(promises)
                .then(() => {
                    logger.debug(TAG, 'All promises resolved');
                    resolve();
                })
                .catch(() => {
                    logger.warning(TAG, 'Promise.all rejected, re-running module');
                    reject();
                });
        }
    });
}

// Build the positions object to dictate the correct position of each text channel
function indexTextChannels() {
    crashHandler.logEvent(TAG, 'indexTextChannels');
    let channels = server.getGuild().channels.array();
    let textChannels = [];
    for (let x in channels) {
        if (channels[x].type === 'text') {
            textChannels.push(channels[x]);
        }
    }

    let last = 0;
    // Index permenant channels
    for (let x in config.getConfig().channels.positions.text) {
        positions.text[config.getConfig().channels.positions.text[x].position] = config.getConfig().channels.positions.text[x].id;
        last = config.getConfig().channels.positions.text[x].position;

        for (let y in textChannels) {
            if (textChannels[y].id === config.getConfig().channels.positions.text[x].id) {
                textChannels = removeID(textChannels, textChannels[y].id);
            }
        }
    }
    // Index event channels
    let eventChannels = [];
    for (let x in textChannels) {
        if (textChannels[x].name.indexOf('-e-') !== -1) {
            eventChannels.push(textChannels[x].name);
        }
    }
    eventChannels.sort();
    for (let x in eventChannels) {
        for (let y in textChannels) {
            if (textChannels[y].name === eventChannels[x]) {
                last++;
                positions.text[last] = textChannels[y].id;
                textChannels = removeID(textChannels, textChannels[y].id);
                break;
            }
        }
    }
    // Index temp channels
    let tempChannels = [];
    for (let x in textChannels) {
        if (textChannels[x].name.indexOf('-t-') !== -1) {
            tempChannels.push(textChannels[x].name);
        }
    }
    tempChannels.sort();
    for (let x in tempChannels) {
        for (let y in textChannels) {
            if (textChannels[y].name === tempChannels[x]) {
                last++;
                positions.text[last] = textChannels[y].id;
                textChannels = removeID(textChannels, textChannels[y].id);
                break;
            }
        }
    }
    // Index whatever is left (should be nothing)
    if (textChannels.length !== 0) {
        logger.devAlert(TAG, 'Text channels not on file found in global sort');
        let extraChannels = [];
        for (let x in textChannels) {
            logger.devAlert(TAG, `Text channel: ${textChannels[x].name} not on file, ` +
                `id: ${textChannels[x].id}`);
            extraChannels.push(textChannels[x].name);
        }
        extraChannels.sort();
        for (let x in extraChannels) {
            for (let y in textChannels) {
                if (textChannels[y].name === extraChannels[x]) {
                    last++;
                    positions.text[last] = extraChannels[y].id;
                    textChannels = removeID(textChannels, textChannels[y].id);
                    break;
                }
            }
        }
    }
    if (textChannels.length !== 0) {
        logger.error(TAG, 'indexTextChannels() failed to sort all channels');
    }
}

// Build the positions object to dictate the correct position of each voice channel
function indexVoiceChannels() {
    crashHandler.logEvent(TAG, 'indexVoiceChannels');
    let channels = server.getGuild().channels.array();
    let voiceChannels = [];
    for (let x in channels) {
        if (channels[x].type === 'voice') {
            if (channels[x].name !== config.getConfig().channels.positions.voice.afk.name) {
                voiceChannels.push(channels[x]);
            }
        }
    }

    let last = 0;
    // Index permenant channels
    for (let x in config.getConfig().channels.positions.voice) {
        if (config.getConfig().channels.positions.voice[x].position !== null) {
            positions.voice[config.getConfig().channels.positions.voice[x].position] = config.getConfig().channels.positions.voice[x].id;
        }
        if (config.getConfig().channels.positions.voice[x].position > last) {
            last = config.getConfig().channels.positions.voice[x].position;
        }

        for (let y in voiceChannels) {
            if (voiceChannels[y].id === config.getConfig().channels.positions.voice[x].id) {
                voiceChannels = removeID(voiceChannels, voiceChannels[y].id);
            }
        }
    }

    // Index MCS channels
    for (let x in config.getConfig().channels.positions.voice) {
        let base = config.getConfig().channels.positions.voice[x].name;
        base = base.substring(base.length - 2);
        if (base === '/1') {
            if (config.getConfig().channels.positions.voice[x].position + 100 > last) {
                last = config.getConfig().channels.positions.voice[x].position + 100;
            }
            base = config.getConfig().channels.positions.voice[x].name;
            base = base.substring(0, base.lastIndexOf('/') + 1);

            for (let i = voiceChannels.length - 1; i > -1; i--) {
                if (voiceChannels[i].name.indexOf(base) !== -1) {
                    let n = parseInt(voiceChannels[i].name.substring(base.length));
                    positions.voice[config.getConfig().channels.positions.voice[x].position + n - 1] =
                        voiceChannels[i].id;
                    voiceChannels = removeID(voiceChannels, voiceChannels[i].id);
                }
            }
        }
    }

    // Index event channels
    let eventChannels = [];
    for (let x in voiceChannels) {
        if (voiceChannels[x].name.indexOf('-e-') !== -1) {
            eventChannels.push(voiceChannels[x].name);
        }
    }
    eventChannels.sort();
    for (let x in eventChannels) {
        for (let y in voiceChannels) {
            if (voiceChannels[y].name === eventChannels[x]) {
                last++;
                positions.voice[last] = voiceChannels[y].id;
                voiceChannels = removeID(voiceChannels, voiceChannels[y].id);
                break;
            }
        }
    }
    // Index temp channels
    let tempChannels = [];
    for (let x in voiceChannels) {
        if (voiceChannels[x].name.indexOf('-t-') !== -1) {
            tempChannels.push(voiceChannels[x].name);
        }
    }
    tempChannels.sort();
    for (let x in tempChannels) {
        for (let y in voiceChannels) {
            if (voiceChannels[y].name === tempChannels[x]) {
                last++;
                positions.voice[last] = voiceChannels[y].id;
                voiceChannels = removeID(voiceChannels, voiceChannels[y].id);
                break;
            }
        }
    }
    // Index whatever is left (should be nothing)
    if (voiceChannels.length !== 0) {
        logger.warning(TAG, 'Voice channels not on file found in global sort');
        let extraChannels = [];
        for (let x in voiceChannels) {
            logger.warning(TAG, `Voice channel: ${voiceChannels[x].name} not on file, ` +
                `id: ${voiceChannels[x].id}`);
            extraChannels.push(voiceChannels[x].name);
        }
        extraChannels.sort();
        for (let x in extraChannels) {
            for (let y in voiceChannels) {
                if (voiceChannels[y].name === extraChannels[x]) {
                    last++;
                    positions.voice[last] = extraChannels[y].id;
                    voiceChannels = removeID(voiceChannels, voiceChannels[y].id);
                    break;
                }
            }
        }
    }
    if (voiceChannels.length !== 0) {
        logger.error(TAG, 'indexVoiceChannels() failed to sort all channels');
    }

    // Set AFK channel position
    positions.voice[last + 1] = config.getConfig().channels.positions.voice.afk.id;
}

// Removes a text channel with a certain ID from an array and returns the new array
function removeID(channels, id) {
    for (let x in channels) {
        if (channels[x].id === id) {
            channels.splice(x, 1);
            return channels;
        }
    }
    logger.error(TAG, 'Attempted to remove channel not found in array');
}

// API request to change position of channel
function requestPosition(channel, position) {
    let old = channel.position;
    if (old === position) {
        logger.debug(TAG, 'requestPosition() sent request to move channnel to its current position');
        return false;
    }
    if (server.getReady() === false) {
        logger.debug(TAG, 'Queueing requestPosition as server not ready');
        let timer = setTimeout(function() {
            this.requestPosition(topicId);
        }, 3000);
        return false;
    }
    if (isNaN(position)) {
        logger.warning(TAG, 'requestPosition() sent request to set a channel to a position that\'s NaN');
        return false;
    }
    return new Promise(function(resolve, reject) {
        channel.setPosition(position)
            .then(channel => {
                logger.info(TAG, `Moved the ${channel.type} channel ${channel.name} to position ` +
                    `${channel.position} from ${old}`);
                resolve();
            })
            .catch(err => {
                logger.warning(TAG, `Failed to set new channel position, error: ${err}`);
                reject();
            });
    });
}

// Run the module again and clear the queue
function queueRelease() {
    crashHandler.logEvent(TAG, 'queueRelease');
    let timer = setTimeout(function() {
        busy = false;
        queue = false;
        logger.debug(TAG, 'Busy marked as FALSE');
        module.exports.globalCheck();
        logger.debug(TAG, 'Released queue');
    }, 3000);
}
