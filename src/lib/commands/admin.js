//  Copyright © 2018 DIG Development team. All rights reserved.

'use strict';

// !admin module, PMs a list of admin commands

const logger = require('../logger.js');

const TAG = '!admin';

const messages = [
    '__Admin Commands__:',
    '**!roles**: PM a list of all roles and their associated IDs',
    '**!positions**: PM a list of all channels and their associated position variables',
    '**!restart**: Restarts the bot (Please do not use unless the bot is spazzing the fuck out)',
    '**!sort**: Manually trigger a global sort of all channels (Should run automatically when necesary)',
];

module.exports = {
    execute(member) {
        let message = '';

        for (let i = 0; i < messages.length; i += 1) {
            message += `${messages[i]}\n`;
        }

        member.sendMessage(message)
            .then(() => {
                logger.debug(TAG, `Succesfully sent admin command list to ${member.displayName}`);
            })
            .catch((err) => {
                logger.warning(TAG, `Failed to send admin command list to ${member.displayName}, ` +
                    `${err}`);
            });

        return `I'll PM you the list of admin commands ${member.displayName}`;
    },
};
