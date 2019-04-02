//  Copyright © 2018 DIG Development team. All rights reserved.

'use strict';

// Handles role requests, can add and remove roles from specified members

const config = require('config');
const logger = require('../logger.js');
const server = require('../server/server.js');

const TAG = ('Role Requests');

module.exports = {
    execute(received) {
        const guild = server.getGuild(config.get('general.server'));
        const member = guild.members.get(received.user);
        if (!member) {
            logger.warning(TAG, `Received roles request for member not found: ${received.user}`);
            /* FAIL RESPONSE NEEDED */
            return;
        }
        if (received.add) {
            const add = guild.roles.find('name', received.add);
            if (!add) {
                logger.warning(TAG, `Received request to add ${received.add} role that does not exist`);
                /* FAIL RESPONSE NEEDED */
            } else {
                removeRoleFromMember(member, add);
            }
        }
        if (received.remove) {
            const remove = guild.roles.find('name', received.remove);
            if (!remove) {
                logger.warning(TAG, `Received request to remove ${received.remove} role that `
                    + `does not exist from ${member.displayName}`);
                /* FAIL RESPONSE NEEDED */
            } else {
                addRoleToMember(member, remove);
            }
        }
    },
};

function addRoleToMember(member, role) {
    member.addRole(role)
        .then(() => {
            logger.debug(TAG, `Succesfully added role to ${member.displayName}`);
            /* SUCCESS RESPONSE NEEDED */
        })
        .catch(/* FAIL RESPONSE NEEDED */);
}

function removeRoleFromMember(member, role) {
    if (!member.roles.has(role)) {
        logger.warning(TAG, `Request received to take ${role.name} role from `
            + `${member.displayName} but they don't have it`);
    }
    member.removeRole(role)
        .then(() => {
            logger.debug(TAG, `Succesfully removed role from ${member.displayName}`);
            /* SUCCESS RESPONSE NEEDED */
        })
        .catch(/* FAIL RESPONSE NEEDED */);
}
