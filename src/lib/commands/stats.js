//  Copyright © 2018 DIG Development team. All rights reserved.

'use strict';

// !stats module

const config = require('../../../config/config.js');
const logger = require('../logger.js');
const performance = require('../tools/performance.js');
const server = require('../server/server.js');
const TAG = '!stats';

module.exports = {
    // Calculate Bot stats and return in message format
    execute: function(msg) {
        msg.channel.sendMessage('pong')
            .then(message => (
                statsCalculations(server.started, msg, message)
            ))
            .catch(err => {
                logger.warning(TAG, `Failed to send message, error: ${err}`);
            });
        return true;
    }
};

function statsCalculations(started, msg, message) {
    // Get performance promises first
    let performancePromises = Promise.all([
        performance.getCpu(),
        performance.getMemory()
    ]);

    performancePromises.then(function(result) {
        let cpu = '**CPU Usage:** ' + result[0] + '%';
        let memory = '**Memory Usage:** ' + result[1] + 'MB';

        let timenow = new Date();

        // DIGBot Version
        let version = '**Version:** ' + config.getConfig().version;

        // Message -> Bot pingtime
        let ms = message.createdTimestamp - msg.createdTimestamp;
        let status = '';
        if (ms < 100) {
            status = '(Excellent)';
        } else if (ms < 200) {
            status = '(Very Good)';
        } else if (ms < 500) {
            status = '(Good)';
        } else if (ms < 1000) {
            status = '(Mediocre)';
        } else {
            status = '(Bad)';
        }
        let pingTime =  '**Ping:** ' + ms + 'ms ' + status;

        // Bot Runtime
        let x = timenow.getTime() - started.getTime();
        x = x / 1000;
        let seconds = x % 60;
        x /= 60;
        let minutes = x % 60;
        x /= 60;
        let hours = x % 24;
        x /= 24;
        let days = x;
        seconds = Math.floor(seconds);
        minutes = Math.floor(minutes);
        hours = Math.floor(hours);
        days = Math.floor(days);
        let runtime = '';
        if (days >= 1) {
            runtime = '**Runtime:** ' + days + ' days, ' + hours + ' hours, ' + minutes + ' minutes, ' + seconds + ' seconds';
        } else if (hours >= 1) {
            runtime =  '**Runtime:** ' + hours + ' hours, ' + minutes + ' minutes, ' + seconds + ' seconds';
        } else if (minutes >= 1) {
            runtime =  '**Runtime:** ' + minutes + ' minutes, ' + seconds + ' seconds';
        } else {
            runtime =  '**Runtime:** ' + seconds + ' seconds';
        }

        // Connection stability
        x = timenow.getTime() - server.getConnectedSince().getTime();
        x = x / 1000;
        seconds = x % 60;
        x /= 60;
        minutes = x % 60;
        x /= 60;
        hours = x % 24;
        x /= 24;
        days = x;
        seconds = Math.floor(seconds);
        minutes = Math.floor(minutes);
        hours = Math.floor(hours);
        days = Math.floor(days);

        let stableConnection = '';

        if (days >= 1) {
            stableConnection = '**Stable Discord connection for:** ' + days + ' days, ' + hours + ' hours, ' + minutes + ' minutes, ' + seconds + ' seconds';
        } else if (hours >= 1) {
            stableConnection =  '**Stable Discord connection for:** ' + hours + ' hours, ' + minutes + ' minutes, ' + seconds + ' seconds';
        } else if (minutes >= 1) {
            stableConnection =  '**Stable Discord connection for:** ' + minutes + ' minutes, ' + seconds + ' seconds';
        } else {
            stableConnection =  '**Stable Discord connection for:** ' + seconds + ' seconds';
        }

        // Members on server and in-game
        let membersOnServer = '**Members on server:** ' + server.getMembersOnServer();
        let ingame = '**Server members in-game:** ' + server.getMembersPlaying();

        //Log, compile and return formated message
        logger.debug(TAG, version);
        logger.debug(TAG, pingTime);
        logger.debug(TAG, cpu);
        logger.debug(TAG, memory);
        logger.debug(TAG, runtime);
        logger.debug(TAG, stableConnection);
        logger.debug(TAG, membersOnServer);
        logger.debug(TAG, ingame);
        let reply = '__**DIGBot Stats**__' +
            '\n' + version +
            '\n' + pingTime +
            '\n' + cpu +
            '\n' + memory +
            '\n' + runtime +
            '\n' + stableConnection +
            '\n' +
            '\n' + '__**Community Stats**__' +
            '\n' + membersOnServer +
            '\n' + ingame;
        message.edit(reply)
            .then(
                logger.debug(TAG, 'Message succesfully edited')
            )
            .catch(error => {
                logger.warning(TAG, 'Failed to edit message ' + error);
            });
    })
    .catch(function(error) {
        logger.warning(TAG, 'Retrieving process stats failed! ' + error);
    });
}
