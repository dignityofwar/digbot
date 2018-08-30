'use strict';

// !ps2digfeedback module

const logger = require('../logger.js');
const server = require('../server/server.js');

module.exports = {
    execute: function() {
        let message = '@here Please post your PS2 Platoon feedback at this form: http://bit.ly/DIGPLFeedback. ' +
            'Note, your feedback **can** be anonymous if you wish it. Simply don\'t fill out your name.';
        server.getChannel('ps2dig').sendMessage(message)
            .then(
                logger.info(TAG, 'Sent feedback form')
            )
            .catch(err => {
                logger.warning(TAG, err);
            });
    }
};
