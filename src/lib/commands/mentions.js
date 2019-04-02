//  Copyright © 2018 DIG Development team. All rights reserved.

'use strict';

// !mentions module, lets a member know how many mentions they're allowed

const config = require('config');
const logger = require('../logger.js');
const mentionsCheck = require('../admin/antispam/mentionspam.js');

const TAG = '!mentions';

module.exports = {
    execute(msg) {
        // Feature switch
        if (config.get('features.disableMentionSpam')) {
            msg.channel.sendMessage(`${msg.member.displayName}, the `
                + 'mention limits are currently disabled. Please don\'t make us regret turning it off though')
                .then(() => {
                    logger.debug(TAG, 'Succesfully sent message');
                })
                .catch((err) => {
                    logger.warning(TAG, `Failed to send message error: ${err}`);
                });
            return false;
        }

        // If member is exempt from limits
        if (mentionsCheck.exemptMember(msg)) {
            msg.channel.sendMessage(`${msg.member.displayName}, you are `
                + 'exempt from the mention limit')
                .then(() => {
                    logger.debug(TAG, 'Succesfully sent message');
                })
                .catch((err) => {
                    logger.warning(TAG, `Failed to send message error: ${err}`);
                });
            return false;
        }

        // Calculate mentions limit
        const list = mentionsCheck.passList();
        let x = config.get('memberMentionLimit');
        let y = config.get('roleMentionLimit');
        if (list[msg.author.id]) {
            x -= list[msg.author.id].memberMentions;
            y -= list[msg.author.id].roleMentions;
        }
        let message = `__${msg.member.displayName}'s mention allowance__:`;
        if (x <= 0) {
            message += '\nMember mentions remaining: 0, **do not attempt to mention members again '
                + 'this period**';
        } else {
            message += `\nMember mentions remaining: ${x}`;
        }
        if (y <= 0) {
            message += '\nRole mentions remaining: 0, **do not attempt to mention roles again '
                + 'this period**';
        } else {
            message += `\nRole mentions remaining: ${y}`;
        }
        message += '\n(*Note: mention limits reset at 4AM*)';
        msg.channel.sendMessage(message)
            .then(() => {
                logger.debug(TAG, 'Succesfully sent message');
            })
            .catch((err) => {
                logger.warning(TAG, `Failed to send message, error: ${err}`);
            });
        return true;
    },
};
