//  Copyright © 2018 DIG Development team. All rights reserved.

// Module to handle modular channel system (MCS), creates and deletes channels to handle online membership

const config = require('config');
const logger = require('../../logger.js');
const server = require('../../server/server.js');

const TAG = 'MCS';

module.exports = {
    execute(oldMember, newMember) {
        if (!config.get('features.modularChannelSystem')) { return false; } // Check MCS is enabled
        if (typeof newMember.voiceChannel === 'object') {
            // Joined channel
            onJoin(newMember);
            // If switched from another channel, check previous channel
            if (typeof oldMember.voiceChannel === 'object') {
                onLeave(oldMember);
            }
            return true;
        }
        // Disconected
        onLeave(oldMember);
        return true;
    },

    // Called on bot.ready, checks if MCS needs to take any action
    ready() {
        if (!config.get('features.modularChannelSystem')) {
            logger.info(TAG, 'Modular Channel System confirmed disabled');
            return false;
        }
        const { channels } = server.getGuild(config.get('general.server'));
        const primaryChannels = [];
        let populatedChannels = [];
        let emptyChannels = [];
        // Find primary channels
        for (const ch of channels) {
            if (ch[1].type === 'voice' && ch[1].name.endsWith('/1')) {
                primaryChannels.push(ch[1].name);
            }
        }
        // For each primary channel scan MCS for action required
        for (let i = 0; i < primaryChannels.length; i += 1) {
            const nameSection = primaryChannels[i].substring(0, primaryChannels[i].lastIndexOf('/') + 1);
            for (const ch of channels) {
                if (ch[1].type === 'voice' && ch[1].name.startsWith(nameSection)) {
                    if (ch[1].members.size === 0) {
                        emptyChannels.push(parseInt(ch[1].name.substring(ch[1].name.lastIndexOf('/') + 1), 10));
                    } else {
                        populatedChannels.push(parseInt(ch[1].name.substring(ch[1].name.lastIndexOf('/') + 1), 10));
                    }
                }
            }
            // No action required
            if (emptyChannels.length === 1) {
                populatedChannels = [];
                emptyChannels = [];
                // TODO: Remove eslint disable line
                continue; // eslint-disable-line
            // One or more channel needs deleting
            } else if (emptyChannels.length > 1) {
                while (emptyChannels.length > 1) {
                    const number = Math.max(...emptyChannels);
                    emptyChannels.splice(emptyChannels.indexOf(number), 1);
                    const channel = channels.find('name', nameSection + number);
                    channel.delete()
                        .then(() => {
                            logger.debug(TAG, 'Channel succesfully deleted');
                        })
                        .catch((err) => {
                            logger.warning(TAG, `Failed to delete channel, error: ${err}`);
                        });
                    logger.info(TAG, `Removed channel: ${nameSection}${number}`);
                }
                populatedChannels = [];
                emptyChannels = [];
            // A channel needs to be created
            } else if (emptyChannels.length === 0) {
                for (let j = 1; j < 100; j += 1) {
                    if (populatedChannels.indexOf(j) === -1) {
                        const name = nameSection + j;
                        const nameAbove = nameSection + (j - 1);
                        const aboveChannel = channels.find('name', nameAbove);
                        const { position } = aboveChannel;
                        aboveChannel.clone(name, true)
                            .then((channel) => {
                                channel.setPosition(position)
                                    .then(() => {
                                        logger.debug(TAG, 'Successfully set channel position');
                                    })
                                    .catch((err) => {
                                        logger.warning(TAG, `Failed to set channel position, error: ${err}`);
                                    });
                            })
                            .catch((err) => {
                                logger.warning(TAG, `Failed to create channel, error: ${err}`);
                            });
                        logger.info(TAG, `Created channel: ${name}`);
                        break;
                    }
                }
                populatedChannels = [];
                emptyChannels = [];
            }
        }
        logger.info(TAG, 'Modular Channel System configured and ready');
        return true;
    },
};

// Create the necessary modular channel
function createChannel(nameSection, numbers, newMember) {
    for (let i = 1; i < 100; i += 1) {
        if (numbers.indexOf(i) === -1) {
            const name = nameSection + i;
            const nameAbove = nameSection + (i - 1);
            let parent = newMember.guild.channels.find('name', nameAbove);

            // Fix for if we have a Channel/2 but no Channel/1 - Issue #189
            if (!parent || !parent.id) {
                logger.info(TAG, 'Attempted to create a voice subchannel when the parent '
                    + `doesn't exist for channel ${name}`);
                return;
            }
            parent = server.getChannelInGuild(parent.id, config.get('general.server')); // Get fresh copy
            logger.debug(TAG, `Before create - Parent position: ${parent.position}`);

            parent.clone(name, true)
                .then((channel) => {
                    channel.edit({
                        bitrate: 96000,
                        position: parent.position + 1,
                    })
                        .then((channel2) => {
                            logger.debug(TAG, `New child position: ${channel2.position}`);

                            // Do a check to make sure the position is correct and is below parent
                            // Get a fresh parent copy
                            parent = server.getChannelInGuild(parent.id, config.get('general.server'));
                            const child = server.getChannelInGuild(channel2.id, config.get('general.server'));
                            logger.debug(TAG, `Post edit - Parent position: ${parent.position}`);
                            logger.debug(TAG, `Child position: ${child.position}`);

                            // If child isn't where it should be
                            if (child.position !== parent.position + 1) {
                                logger.debug(TAG, 'Resetting position...');

                                // For some reason setting it to the exact position works?!
                                child.edit({
                                    position: parent.position + 1,
                                })
                                    .then((channel3) => {
                                        logger.debug(TAG, `Succesfully reset child position - ${channel3.position}`);
                                    })
                                    .catch((err) => {
                                        logger.warning(TAG, `Failed to reset child position - ${err}`);
                                    });
                            }
                        })
                        .catch((err) => {
                            logger.warning(TAG, `Failed to set channel properties, error: ${err}`);
                        });
                })
                .catch((err) => {
                    logger.debug(TAG, `Failed to create channel, error: ${err}`);
                });
            logger.info(TAG, `Created channel: ${name}`);
        }
    }
}

// Delete the modular channel
function deleteChannel(nameSection, numberSection, member) {
    const channelName = nameSection + numberSection;
    const channel = member.guild.channels.find('name', channelName);

    if (channel) {
        channel.delete()
            .then(() => {
                logger.debug(TAG, 'Successfully deleted channel');
            })
            .catch((err) => {
                logger.warning(TAG, `Failed to delete channel, error: ${err}`);
            });
        logger.info(TAG, `Removed channel: ${channelName}`);
    } else {
        logger.warning(TAG, `Attempted to delete a non-existant channel: ${channel}`);
    }
}

// Check if a modular channel needs to be created, array of numbers if yes, false if no
function joinCheck(newMember, numberSection, nameSection) {
    let create = true;
    const array = [];
    for (const ch of newMember.guild.channels) {
        if (ch[1] && ch[1].type === 'voice') {
            if (ch[1].name.startsWith(nameSection)) {
                array.push(parseInt(ch[1].name.substring(nameSection.length), 10));
                if (ch[1].members.size === 0) {
                    create = false;
                }
            }
        }
    }
    if (create) {
        return array;
    }
    return false;
}

// Called if the member left a channel that is now empty, check if a channel should be deleted, if so delete
function leaveCheck(oldMember, numberSection, nameSection) {
    const array = [];
    for (const ch of oldMember.guild.channels) {
        if (ch[1] && ch[1].type === 'voice') {
            if (ch[1].name.startsWith(nameSection)) {
                if (ch[1].members.size === 0) {
                    array.push(parseInt(ch[1].name.substring(nameSection.length), 10));
                }
            }
        }
    }
    while (array.length > 1) {
        const newNumberSection = Math.max(...array);
        array.splice(array.indexOf(newNumberSection), 1);
        deleteChannel(nameSection, newNumberSection, oldMember);
    }
}

// Called whenever a member joins a channel
function onJoin(newMember) {
    if (!newMember.voiceChannel) { return false; }
    if (newMember.voiceChannel.name.indexOf('/') !== -1) {
        const lastIndex = newMember.voiceChannel.name.lastIndexOf('/');
        const numberSection = newMember.voiceChannel.name.substring(lastIndex + 1);
        const nameSection = newMember.voiceChannel.name.substring(0, lastIndex + 1);
        if (!Number.isNaN(numberSection)) {
            const numbers = joinCheck(newMember, numberSection, nameSection);
            if (!numbers) {
                return false;
            }
            createChannel(nameSection, numbers, newMember);
            return true;
        }
    }
    return false;
}

// Called whenever a member leaves a channel
function onLeave(oldMember) {
    if (!oldMember.voiceChannel) { return; }
    if (oldMember.voiceChannel.name.indexOf('/') !== -1) {
        if (oldMember.voiceChannel.members.size === 0) {
            const lastIndex = oldMember.voiceChannel.name.lastIndexOf('/');
            const numberSection = oldMember.voiceChannel.name.substring(lastIndex + 1);
            const nameSection = oldMember.voiceChannel.name.substring(0, lastIndex + 1);
            if (!Number.isNaN(numberSection)) {
                leaveCheck(oldMember, numberSection, nameSection);
            }
        }
    }
}
