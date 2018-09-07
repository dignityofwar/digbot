//  Copyright © 2018 DIG Development team. All rights reserved.

'use strict';

// Module to check if the user is attempting to post a stream outside of the streaming channel

const config = require('config');
const logger = require('../../logger.js');
const server = require('../../server/server.js');
const TAG = 'Stream Antispam';

module.exports = {
    execute: function(msg) {
        if (msg.guild.id !== config.get('general.server')) { return; }
        if (msg.member.id === config.get('botUserID')) { return; }
        let message = msg.content.replace(/\s+/g, '').toLowerCase();
        if (message.includes('twitch.tv/') || message.includes('hitbox.tv/') || message.includes('beam.pro/')) {
            if (!message.includes('clips')) {
                if (msg.channel.id != configget('channels.mappings.streams')) {
                    return streamSpamAction(msg);
                }
            }
        }
        return true;
    }
};

// Called in confirmed cases of stream spam, delete message, leave a message and move it into #streams
function streamSpamAction(msg) {
    logger.info(TAG, 'Moved ' + msg.member.displayName + '\'s stream link to the stream channel');
    msg.channel.sendMessage(msg.member.displayName +
        ', we have a specific channel for streams - #streams. I\'ve moved your message there.')
        .then(
            logger.debug(TAG, 'Successfully sent streamSpamAction message')
        )
        .catch(err => {
            logger.warning(TAG, `Failed to send message, error: ${err}`);
        });
    msg.guild.channels.get(configget('channels.mappings.streams')).sendMessage(
        msg.member.displayName + ': ' + msg.cleanContent)
        .then(message => {
            logger.info(TAG, `Moved to #streams: ${message.content}`);
        })
        .catch(err => {
            logger.warning(TAG, `Failed to send streamSpamAction message, error ${err}`);
        });
    msg.delete();
    return false;
}
