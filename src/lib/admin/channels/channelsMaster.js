//  Copyright © 2018 DIG Development team. All rights reserved.

// The master module for channel related actions

const config = require('config');
const logger = require('../../logger.js');
const server = require('../../server/server.js');

const TAG = 'Channels Master';

const timelog = {}; // To log time the last message was sent in temp and event text channels

module.exports = {
    // Passed all messages sent in -e- and -t- text channels, stores timestamps for inactivity checks
    activityLog(msg) {
        timelog[msg.channel.id] = msg.createdTimestamp;
    },

    // Approve the creation of channels
    checkCreation(ch) {
        const channels = server.getGuild().channels.array();
        // Do not allow channels of same type with identical names
        for (const x in channels) {
            if (channels[x].type === ch.type
            && channels[x].name === ch.name
            && channels[x].id !== ch.id) {
                ch.delete()
                    .then(() => {
                        logger.devAlert(TAG, `The channel ${ch.name} was deleted upon creation as it held `
                            + 'an identical name and type to an existing channel');
                    })
                    .catch((err) => {
                        logger.warning(TAG, `Failed to delete channel, error: ${err}`);
                    });
                return;
            }
        }
    },

    // Check if channel is being used, deletes channel if inactive, takes channel and msg objects
    deleteInactive(channel, msg) {
        if (channel.type === 'voice') {
            if (channel.members.size === 0) {
                this.deleteChannel(channel, msg);
                return true;
            }
            if (msg !== undefined) {
                msg.channel.send('Sorry I can\'t delete a temporary channel when '
                    + 'people are still in it that would be quite rude.')
                    .then((message) => {
                        logger.info(TAG, `Sent message: ${message.content}`);
                    })
                    .catch((err) => {
                        logger.warning(TAG, `Failed to send message, error: ${err}`);
                    });
            }
            return false;
        }
        if (channel.type === 'text') {
            if (channel.lastMessageID) {
                channel.fetchMessage(channel.lastMessageID)
                    .then((lastMessage) => {
                        const now = Date.now();
                        if (now - lastMessage.createdTimestamp > config.get('textInactive')) {
                            this.deleteChannel(channel, msg);
                            return true;
                        }
                        rejectCase(msg);
                        return false;
                    })
                    .catch((err) => {
                        logger.warning(TAG, `Failed to fetch message, error: ${err}`);
                        return false;
                    });
            } else {
                rejectCase(msg);
            }
        } else {
            throw new Error(`${TAG}: Channel.type neither text nor voice, type: ${channel.type}`);
        }
        return false;
    },

    // Function to delete channel and log, msg arguement optional
    deleteChannel(channel, msg) {
        logger.info(TAG, `Deleted channel: ${channel.name}`);
        if (msg !== undefined) {
            msg.channel.send(`The ${channel.type} channel ${channel.name} was `
                + 'succesfully deleted')
                .then((message) => {
                    logger.info(TAG, `Sent message: ${message.content}`);
                })
                .catch((err) => {
                    logger.warning(TAG, `Failed to send message: ${err}`);
                });
        }
        channel.delete();
    },
};

// In case the channel can't be deleted let the requester know and refuse the deletion
function rejectCase(msg) {
    if (msg !== undefined) {
        msg.channel.send('Sorry I can\'t delete that channel as it\'s not '
            + 'inactive, I only delete text channels where the last message was sent '
            + 'over 2 hours ago. They\'ll be automatically deleted after then.')
            .then((message) => {
                logger.info(TAG, `Sent message: ${message.content}`);
            })
            .catch((err) => {
                logger.warning(TAG, `Failed to send meesage, error: ${err}`);
            });
    }
    return false;
}
