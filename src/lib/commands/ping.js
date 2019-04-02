//  Copyright © 2018 DIG Development team. All rights reserved.

'use strict';

// !ping module

const logger = require('../logger.js');

const TAG = '!ping';

module.exports = {
    // Replies with pingtime
    execute(msg) {
        msg.channel.sendMessage('pong')
            .then((message) => {
                pong(message, msg);
            })
            .catch((err) => {
                logger.warning(TAG, `Failed to send message, error: ${err}`);
            });
    },
};

// Once the "pong" message has been sent, use time between the two messages to calculate ping
function pong(message, msg) {
    const ms = message.createdTimestamp - msg.createdTimestamp;
    let status = '';
    if (ms < 50) {
        status = '(Excellent)';
    } else if (ms < 100) {
        status = '(Very Good)';
    } else if (ms < 300) {
        status = '(Good)';
    } else if (ms < 1000) {
        status = '(Mediocre)';
    } else {
        status = '(Bad)';
    }
    message.edit(`Ping: ${ms}ms ${status}`)
        .then(() => {
            logger.debug(TAG, 'Succesfully editted message');
        })
        .catch((err) => {
            logger.warning(TAG, `Failed to edit message error: ${err}`);
        });
    logger.info(TAG, `Called by: ${msg.member.displayName}, reply: ${ms}ms`);
}
