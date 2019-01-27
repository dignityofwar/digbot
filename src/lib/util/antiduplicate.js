//  Copyright © 2018 DIG Development team. All rights reserved.

// Module to prevent passed messages repeating for commands like !catfacts

const logger = require('../logger.js');

const TAG = 'Anti Duplicate';

// Define global object to store the indentifier of the last dank ass meme posted for each command
const lastpost = {};

module.exports = {
    // Searches the array and compares against recent messages, ensuring we get semi-random values
    randomise(ref, array) {
        // If theres only one message, then return it.
        if (array.length === 1) {
            return array[0];
        }

        let rand = Math.floor(Math.random() * array.length);
        let message = array[rand];

        // If the previous message has already been sent
        if (typeof lastpost[ref] === 'undefined') {
            lastpost[ref] = message;
            return message; // Nothing more to do here
        }

        if (lastpost[ref].indexOf(message) > -1) {
            logger.debug(TAG, 'antiduplicate', `Anti duplicate code triggered for check: ${ref}`);

            let check = lastpost[ref].indexOf(message);

            // Loop through the array and keep trying until we can pull out a message we've not seen
            for (let runs = 0; runs < 30 && check !== -1; runs++) { // eslint-disable-line no-plusplus
                rand = Math.floor(Math.random() * array.length);
                message = array[rand];
                check = lastpost[ref].indexOf(message);
                logger.debug(TAG, 'antiduplicate', `Run ${runs}`);
                logger.debug(TAG, 'antiduplicate', `Rand ${rand}`);
                logger.debug(TAG, 'antiduplicate', `Check ${check}`);
            }
        }

        // Add the newly selected message to the object
        lastpost[ref] = message;

        return message;
    },
};
