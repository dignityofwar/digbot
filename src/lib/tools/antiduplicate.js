//  Copyright © 2018 DIG Development team. All rights reserved.

'use strict';

// Module to prevent passed messages repeating for commands like !catfacts

const logger = require('../logger.js');
const TAG = 'Anti Duplicate';

// Define global object to store the indentifier of the last dank ass meme posted for each command
let lastpost = {};

module.exports = {
    // Searches the array and compares against recent messages, ensuring we get semi-random values
    randomise: function(ref, array) {
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
            logger.debug(TAG, 'antiduplicate', 'Anti duplicate code triggered for check: ' + ref);

            let runs = 0;
            let check = lastpost[ref].indexOf(message);

            // Loop through the array and keep trying until we can pull out a message we've not seen
            while (runs < 30 && check !== -1) {
                rand = Math.floor(Math.random() * array.length);
                message = array[rand];
                runs++;
                check = lastpost[ref].indexOf(message);
                logger.debug(TAG, 'antiduplicate', 'Run ' + runs);
                logger.debug(TAG, 'antiduplicate', 'Rand ' + rand);
                logger.debug(TAG, 'antiduplicate', 'Check ' + check);
            }
        }

        // Add the newly selected message to the object
        lastpost[ref] = message;

        return message;
    }
};
