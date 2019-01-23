//  Copyright © 2018 DIG Development team. All rights reserved.

// !stats module

// const config = require('config');
const { duration } = require('moment');
const logger = require('../logger.js');
const performance = require('../tools/performance.js');
const pjson = require('../../../package');

const TAG = '!stats';

/* eslint no-use-before-define: 0 */
module.exports = {
    // Calculate Bot stats and return in message format
    execute(msg) {
        msg.channel.sendMessage('pong')
            .then(message => (
                statsCalculations(message)
            ))
            .catch(err => logger.warning(TAG, `Failed to send message, error: ${err}`));

        return true;
    },
};

function statsCalculations(message) {
    // Get performance promises first
    Promise.all([
        performance.getCpu(),
        performance.getMemory(),
    ])
        .then(([cpu, memory]) => {
            const pingStatus = (ping) => {
                if (ping < 100) {
                    return 'Excellent';
                }
                if (ping < 200) {
                    return 'Very Good';
                }
                if (ping < 500) {
                    return 'Good';
                }
                if (ping < 1000) {
                    return 'Mediocre';
                }
                return 'Bad';
            };

            // Log, compile and return formated message
            // logger.debug(TAG, version);
            // logger.debug(TAG, pingTime);
            // logger.debug(TAG, cpu);
            // logger.debug(TAG, memory);
            // logger.debug(TAG, runtime);
            // logger.debug(TAG, stableConnection);
            // logger.debug(TAG, membersOnServer);
            // logger.debug(TAG, ingame);

            // TODO: Investegate guild presences size.
            message.edit(`
            __**DIGBot Stats**__
            **CPU Usage:** ${cpu}%
            **Memory Usage:** ${memory}MB
            **Version:** ${pjson.version}
            **Ping:** ${message.client.ping}ms (${pingStatus(message.client.ping)})
            **Runtime:** ${duration(process.uptime(), 'seconds').humanize()}
            **Stable Discord connection for:** ${duration(message.client.uptime).humanize()}
            **Members on server:** ${message.guild.memberCount}
            **Server members in-game:** ${message.guild.presences.size}
            `)
                .then(() => logger.debug(TAG, 'Message succesfully edited'))
                .catch(error => logger.warning(TAG, `Failed to edit message ${error}`));
        })
        .catch(error => logger.warning(TAG, `Retrieving process stats failed! ${error}`));
}
