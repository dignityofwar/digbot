//  Copyright © 2018 DIG Development team. All rights reserved.

'use strict';

// Automatically assign roles if the member is missing them

const config = require('config');
const logger = require('../../logger.js');
const server = require('../../server/server.js');

const TAG = 'detectPlaying';

module.exports = {
    /* Check member objects for what game if any the member is playing, if we have a role for the
    game and the member is missing it add them and announce the action */
    check(oldMember, newMember) {
        if (!config.get('features.automaticRoleAssignment')) { return false; } // Feature switch
        if (oldMember.presence.game) {
            for (const communitygame in config.get('communityGames')) {
                const ref = config.get('communityGames')[communitygame];
                if (typeof oldMember.presence.game.name === 'string'
                    && oldMember.presence.game.name.includes(ref.name)) {
                    for (let i = 0; i < ref.roleids.length; i += 1) {
                        if (oldMember.roles.has(ref.roleids[i])) {
                            if (newMember) {
                                return secondCheck(newMember);
                            }
                            return false;
                        }
                    }
                    addMissingRole(oldMember, ref);
                    return true;
                }
            }
            for (const recreationalgame in config.get('recreationalGames')) {
                const ref = config.get('recreationalGames')[recreationalgame];
                if (typeof oldMember.presence.game.name === 'string'
                    && oldMember.presence.game.name.includes(ref.name)) {
                    for (let i = 0; i < ref.roleids.length; i += 1) {
                        if (oldMember.roles.has(ref.roleids[i])) {
                            if (newMember) {
                                return secondCheck(newMember);
                            }
                            return false;
                        }
                    }
                    addMissingRole(oldMember, ref);
                    return true;
                }
            }
        }
        if (newMember) {
            return secondCheck(newMember);
        }
        return false;
    },
};

// If two members were recieved to be checked, check the second member
function secondCheck(newMember) {
    if (newMember.presence.game) {
        const communityGames = config.get('communityGames');
        for (const communitygame in communityGames) {
            const ref = communityGames[communitygame];
            if (typeof newMember.presence.game.name === 'string'
                && newMember.presence.game.name.includes(ref.name)) {
                for (let i = 0; i < ref.roleids.length; i += 1) {
                    if (newMember.roles.has(ref.roleids[i])) {
                        return false;
                    }
                }
                addMissingRole(newMember, ref);
                return true;
            }
        }
        const recreationalGames = config.get('recreationalGames');
        for (const recreationalGame in recreationalGames) {
            const ref = recreationalGames[recreationalGame];
            if (typeof newMember.presence.game.name === 'string'
                && newMember.presence.game.name.includes(ref.name)) {
                for (let i = 0; i < ref.roleids.length; i += 1) {
                    if (newMember.roles.has(ref.roleids[i])) {
                        return false;
                    }
                }
                addMissingRole(newMember, ref);
                return true;
            }
        }
    }
    return false;
}

// If the member is missing a role, give them the role and notifty the primary channel
function addMissingRole(member, game) {
    logger.info(TAG, `Identified ${member.displayName} was missing the `
        + `${game.name} tag, attempting to update roles`);
    if (!server.getRole(game.roleids[0])) {
        logger.warning(TAG, `Missing role for game: ${game.name}`);
        return false;
    }
    member.addRole(game.roleids[0])
        .then(() => {
            logger.debug(TAG, 'Role succesfully added');
            const channel = server.getGuild(config.get('general.server')).channels.get(game.primaryChannel);
            if (channel !== undefined) {
                channel.sendMessage(`${member} has been given the role to see this channel. Welcome!`)
                    .then(() => {
                        logger.debug(TAG, 'Succesfully sent role update message');
                    })
                    .catch((err) => {
                        logger.warning(TAG, `Failed to send message: ${err}`);
                    });
            }
        })
        .catch((err) => {
            logger.warning(TAG, `Role failed to add: ${err}`);
        });
    return true;
}
