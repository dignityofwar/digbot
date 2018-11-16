//  Copyright © 2018 DIG Development team. All rights reserved.

'use strict';

// !dragons module

const config = require('config');
const logger = require('../logger.js');
const server = require('../server/server.js');
const TAG = '!dragons';

module.exports = {
    execute: function(msg) {
        const roles = msg.member.roles;

        if (roles.has(config.get('general.herebedragonsRoleID'))) {
            logger.info(TAG, 'User ' + msg.member.displayName + ' already has herebedragons role. Removing.');

            msg.member.removeRole(config.get('general.herebedragonsRoleID'))
                .then(function() {
                    logger.info(TAG, 'Unsubscribed ' + msg.member.displayName + ' from herebedragons.');
                })
                .catch(function() {
                    logger.warning(TAG, 'Failed to remove #herebedragons role from ' + msg.member.displayName);
                });

            msg.reply('you already had the herebedragons role. I\'ve removed it. Type **!dragons** again to resubscribe.')
                .then(function() {
                    logger.info(TAG, 'Informed ' + msg.member.displayName + ' that they already have herebedragons.');
                })
                .catch(function(err) {
                    logger.warning(TAG, `Failed to send herebedragons message, error: ${err}`);
                });
            return false;
        } else {
            msg.member.addRole(config.get('general.herebedragonsRoleID'))
                .then(function() {
                    logger.info(TAG, 'Added herebedragons role to ' + msg.member.displayName);

                    msg.guild.channels.get(config.get('channels.mappings.herebedragons')).sendMessage(
                        msg.member + ' has been granted access here. ' +
                        'Note, this channel is lawless. If you get triggered, the community staff cannot help you.'
                    )
                        .then(function() {
                            logger.info(TAG, 'Sent herebedragons welcome message to ' + msg.member.displayName);
                        })
                        .catch(function(err) {
                            logger.warning(TAG, `Failed to send herebedragons welcome message, error: ${err}`);
                        });
                })
                .catch(function(err) {
                    logger.warning(TAG, `Failed to add role, error: ${err}`);
                });
            return true;
        }
    }
};
