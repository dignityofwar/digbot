//  Copyright © 2018 DIG Development team. All rights reserved.

'use strict';

// !restart module, restarts the bot

const crashHandler = require('../crash-handling.js');
const logger = require('../logger.js');

const TAG = '!restart';

module.exports = {
    execute(msg) {
        logger.devAlert(TAG, `Recieved restart request from ${msg.member.displayName}, restarting...`);
        msg.channel.sendMessage('Restarting bot...')
            .then(() => {
                logger.debug(TAG, 'Succesfully sent message to text channel');
            })
            .catch((err) => {
                logger.warning(TAG, `Message failed to send, ${err}`);
            });
        /* Count down to restart, don't wait on a resolve/reject from above promises as they may be
        mega slow or something and the reason for restarting */
        setTimeout(() => {
            crashHandler.logEvent(TAG, 'Restarting');
            logger.error(TAG, 'Restarting bot as per request');
        }, 5000);
    },
};
