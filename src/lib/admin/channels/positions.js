//  Copyright © 2018 DIG Development team. All rights reserved.

// Calculates and enforces the positions that channels should hold

const config = require('config');
const crashHandler = require('../../crash-handling.js');
const logger = require('../../logger.js');
const server = require('../../server/server.js');

const TAG = 'Channel Positions';

let busy = false; // If the module is running
const positions = {};
let queue = false; // If the module needed to run again, run fresh as soon as the module's free

module.exports = {
    // Check the positioning of all channels on the server
    globalCheck() {
        crashHandler.logEvent(TAG, 'globalCheck');
        if (!config.get('features.channelPositionsEnforcement')) { return; } // Feature switch
        // Don't let this module run twice at once
        if (busy) {
            queue = true;
            logger.debug(TAG, 'Global sort busy, queuing');
            return;
        }
        logger.debug(TAG, 'Marking global sort as busy');
        busy = true;

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
                        setTimeout(() => {
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
            setTimeout(() => {
                queueRelease();
            }, 10000);
        }
    },
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
    return new Promise((resolve, reject) => {
        const channels = server.getGuild().channels.array();
        const textChannels = [];
        const voiceChannels = [];
        for (const x in server.getGuild().channels.array()) {
            if (channels[x].type === 'text') {
                textChannels.push(channels[x]);
            }
            if (channels[x].type === 'voice') {
                voiceChannels.push(channels[x]);
            }
        }
        const promises = [];
        for (const x in textChannels) {
            if (positions.text[textChannels[x].position] !== textChannels[x].id) {
                for (const y in positions.text) {
                    if (positions.text[y] === textChannels[x].id) {
                        const p = requestPosition(textChannels[x], y);
                        if (p !== false) {
                            promises.push(p);
                        }
                    }
                }
            }
        }
        for (const x in voiceChannels) {
            if (positions.voice[voiceChannels[x].position] !== voiceChannels[x].id) {
                for (const y in positions.voice) {
                    if (positions.voice[y] === voiceChannels[x].id) {
                        const p = requestPosition(voiceChannels[x], y);
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
    const channels = server.getGuild().channels.array();
    let textChannels = [];
    for (const x in channels) {
        if (channels[x].type === 'text') {
            textChannels.push(channels[x]);
        }
    }

    let last = 0;
    // Index permenant channels
    for (const x in config.get('channels.positions.text')) {
        positions.text[config.get('channels.positions.text')[x].position] = config.get('channels.positions.text')[x].id;
        last = config.get('channels.positions.text')[x].position;

        for (const y in textChannels) {
            if (textChannels[y].id === config.get('channels.positions.text')[x].id) {
                textChannels = removeID(textChannels, textChannels[y].id);
            }
        }
    }
    // Index event channels
    const eventChannels = [];
    for (const x in textChannels) {
        if (textChannels[x].name.indexOf('-e-') !== -1) {
            eventChannels.push(textChannels[x].name);
        }
    }
    eventChannels.sort();
    for (const x in eventChannels) {
        for (const y in textChannels) {
            if (textChannels[y].name === eventChannels[x]) {
                last += 1;
                positions.text[last] = textChannels[y].id;
                textChannels = removeID(textChannels, textChannels[y].id);
                break;
            }
        }
    }
    // Index temp channels
    const tempChannels = [];
    for (const x in textChannels) {
        if (textChannels[x].name.indexOf('-t-') !== -1) {
            tempChannels.push(textChannels[x].name);
        }
    }
    tempChannels.sort();
    for (const x in tempChannels) {
        for (const y in textChannels) {
            if (textChannels[y].name === tempChannels[x]) {
                last += 1;
                positions.text[last] = textChannels[y].id;
                textChannels = removeID(textChannels, textChannels[y].id);
                break;
            }
        }
    }
    // Index whatever is left (should be nothing)
    if (textChannels.length !== 0) {
        logger.devAlert(TAG, 'Text channels not on file found in global sort');
        const extraChannels = [];
        for (const x in textChannels) {
            logger.devAlert(TAG, `Text channel: ${textChannels[x].name} not on file, `
                + `id: ${textChannels[x].id}`);
            extraChannels.push(textChannels[x].name);
        }
        extraChannels.sort();
        for (const x in extraChannels) {
            for (const y in textChannels) {
                if (textChannels[y].name === extraChannels[x]) {
                    last += 1;
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
    const channels = server.getGuild().channels.array();
    let voiceChannels = [];
    for (const x in channels) {
        if (channels[x].type === 'voice') {
            if (channels[x].name !== config.get('channels.positions.voice.afk.name')) {
                voiceChannels.push(channels[x]);
            }
        }
    }

    let last = 0;
    // Index permenant channels
    const voicePositions = config.get('channels.positions.voice');
    for (const x in voicePositions) {
        if (voicePositions[x].position !== null) {
            positions.voice[voicePositions[x].position] = voicePositions[x].id;
        }
        if (voicePositions[x].position > last) {
            last = voicePositions[x].position;
        }

        for (const y in voiceChannels) {
            if (voiceChannels[y].id === voicePositions[x].id) {
                voiceChannels = removeID(voiceChannels, voiceChannels[y].id);
            }
        }
    }

    // Inconst MCS channels
    for (const x in voicePositions) {
        let base = voicePositions[x].name;
        base = base.substring(base.length - 2);
        if (base === '/1') {
            if (voicePositions[x].position + 100 > last) {
                last = voicePositions[x].position + 100;
            }
            base = voicePositions[x].name;
            base = base.substring(0, base.lastIndexOf('/') + 1);

            for (let i = voiceChannels.length - 1; i > -1; i -= 1) {
                if (voiceChannels[i].name.indexOf(base) !== -1) {
                    const n = parseInt(voiceChannels[i].name.substring(base.length), 10);
                    positions.voice[(voicePositions[x].position + n) - 1] = voiceChannels[i].id;
                    voiceChannels = removeID(voiceChannels, voiceChannels[i].id);
                }
            }
        }
    }

    // Index event channels
    const eventChannels = [];
    for (const x in voiceChannels) {
        if (voiceChannels[x].name.indexOf('-e-') !== -1) {
            eventChannels.push(voiceChannels[x].name);
        }
    }
    eventChannels.sort();
    for (const x in eventChannels) {
        for (const y in voiceChannels) {
            if (voiceChannels[y].name === eventChannels[x]) {
                last += 1;
                positions.voice[last] = voiceChannels[y].id;
                voiceChannels = removeID(voiceChannels, voiceChannels[y].id);
                break;
            }
        }
    }
    // Index temp channels
    const tempChannels = [];
    for (const x in voiceChannels) {
        if (voiceChannels[x].name.indexOf('-t-') !== -1) {
            tempChannels.push(voiceChannels[x].name);
        }
    }
    tempChannels.sort();
    for (const x in tempChannels) {
        for (const y in voiceChannels) {
            if (voiceChannels[y].name === tempChannels[x]) {
                last += 1;
                positions.voice[last] = voiceChannels[y].id;
                voiceChannels = removeID(voiceChannels, voiceChannels[y].id);
                break;
            }
        }
    }
    // Index whatever is left (should be nothing)
    if (voiceChannels.length !== 0) {
        logger.warning(TAG, 'Voice channels not on file found in global sort');
        const extraChannels = [];
        for (const x in voiceChannels) {
            logger.warning(TAG, `Voice channel: ${voiceChannels[x].name} not on file, `
                + `id: ${voiceChannels[x].id}`);
            extraChannels.push(voiceChannels[x].name);
        }
        extraChannels.sort();
        for (const x in extraChannels) {
            for (const y in voiceChannels) {
                if (voiceChannels[y].name === extraChannels[x]) {
                    last += 1;
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
    positions.voice[last + 1] = config.get('channels.positions.voice.afk.id');
}

// Removes a text channel with a certain ID from an array and returns the new array
function removeID(channels, id) {
    for (const x in channels) {
        if (channels[x].id === id) {
            channels.splice(x, 1);
            return channels;
        }
    }
    logger.error(TAG, 'Attempted to remove channel not found in array');
    return false;
}

// API request to change position of channel
function requestPosition(channel, position) {
    const old = channel.position;
    if (old === position) {
        logger.debug(TAG, 'requestPosition() sent request to move channnel to its current position');
        return false;
    }
    if (server.getReady() === false) {
        logger.debug(TAG, 'Queueing requestPosition as server not ready');
        setTimeout(() => {
            this.requestPosition(channel, position);
        }, 3000);
        return false;
    }
    if (Number.isNaN(position)) {
        logger.warning(TAG, 'requestPosition() sent request to set a channel to a position that\'s NaN');
        return false;
    }
    return new Promise((resolve, reject) => {
        channel.setPosition(position)
            .then((channel2) => {
                logger.info(TAG, `Moved the ${channel2.type} channel ${channel2.name} to position `
                    + `${channel2.position} from ${old.position}`);
                resolve();
            })
            .catch((err) => {
                logger.warning(TAG, `Failed to set new channel position, error: ${err}`);
                reject();
            });
    });
}

// Run the module again and clear the queue
function queueRelease() {
    crashHandler.logEvent(TAG, 'queueRelease');
    setTimeout(() => {
        busy = false;
        queue = false;
        logger.debug(TAG, 'Busy marked as FALSE');
        module.exports.globalCheck();
        logger.debug(TAG, 'Released queue');
    }, 3000);
}
