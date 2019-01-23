//  Copyright © 2018 DIG Development team. All rights reserved.

// !ping module

const logger = require('../logger.js');

const TAG = '!ping';

module.exports = {
    // Replies with pingtime
    execute(msg) {
        msg.channel.sendMessage('pong')
            .then(message => pong(message))
            .catch(err => logger.warning(TAG, `Failed to send message, error: ${err}`));
    },
};

// Once the "pong" message has been sent, use time between the two messages to calculate ping
function pong(message) {
    const pingStatus = (ping) => {
        if (ping < 100) {
            return 'Excellent';
        }
        if (ping < 200) {
            return 'Very Good';
        }
        if (ping < 500) {
            return 'Good';
        }
        if (ping < 1000) {
            return 'Mediocre';
        }
        return 'Bad';
    };

    message.edit(`Ping: ${message.client.ping}ms (${pingStatus(message.client.ping)})`)
        .then(() => logger.debug(TAG, 'Succesfully editted message'))
        .catch(err => logger.warning(TAG, `Failed to edit message error: ${err}`));
    // logger.info(TAG, 'Called by: ' + msg.member.displayName + ', reply: ' + ms + 'ms');
}
