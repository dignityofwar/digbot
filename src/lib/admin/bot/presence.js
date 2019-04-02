//  Copyright © 2018 DIG Development team. All rights reserved.

'use strict';

// Updates the bots current presence

const config = require('config');
const logger = require('../../logger.js');
const server = require('../../server/server.js');

const TAG = 'Presence';

let currentMembers = 0;

module.exports = {
    execute() {
        if (server.getReady() === false) { return; }
        const clientUser = server.getGuild().members.get(config.get('botUserID')).user;
        const members = server.getMembersPlaying();

        // Don't do an API call if we don't need to
        if (currentMembers !== members) {
            currentMembers = members;
            clientUser.setPresence({ game: { name: `${members} members in-game` } })
                .then(() => {
                    logger.info(TAG, `Successfully updated clientUser's presence. ${currentMembers} detected.`);
                })
                .catch((err) => {
                    logger.warning(TAG, `Failed to update clientUser's presence, ${err}`);
                });
        }
    },
};
