//  Copyright © 2018 DIG Development team. All rights reserved.

// Handles message requests to channels

const config = require('config');
const logger = require('../logger.js');
const server = require('../server/server.js');

const TAG = ('Message Channel Requests');

module.exports = {
    execute(received) {
        const guild = server.getGuild(config.get('general.server'));
        const channel = guild.channels.get(received.channel);
        if (!channel) {
            logger.warning(TAG, `Received message request for channel not found: ${received.channel}`);
            /* FAIL RESPONSE NEEDED */
            return;
        }
        channel.send(received.content, { split: true })
            .then(() => {
                logger.debug(TAG, `Succesfully sent message to ${channel.name}`);
                /* SUCCESS RESPONSE NEEDED */
            })
            .catch(/* FAIL RESPONSE NEEDED */);
    },
};
