//  Copyright © 2018 DIG Development team. All rights reserved.

'use strict';

/* Handles message requests to users, note: Due to discord (not discord.js) limitations, we can
only message users that are on our discord server */

const config = require('config');
const logger = require('../logger.js');
const server = require('../server/server.js');

const TAG = ('Message User Requests');

module.exports = {
    execute(received) {
        const guild = server.getGuild(config.get('general.server'));
        const member = guild.members.get(received.user);
        if (!member) {
            logger.warning(TAG, `Received message request for member not found: ${received.user}`);
            /* FAIL RESPONSE NEEDED */
            return;
        }
        member.sendMessage(received.content, { split: true })
            .then(() => {
                logger.debug(TAG, `Succesfully sent message to ${member.displayName}`);
                /* SUCCESS RESPONSE NEEDED */
            })
            .catch(/* FAIL RESPONSE NEEDED */);
    },
};
