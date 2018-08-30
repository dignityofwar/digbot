//  Copyright © 2018 DIG Development team. All rights reserved.

'use strict';

// Handles crashes by compiling crash reports and sending them to console/dev channel

const logger = require('./logger.js');
const TAG = 'Crash Handler';

let eventBuffer = [];
let messageBuffer = [];

module.exports = {
    // On bot.error
    error: function(err) {
        crash(err, 'Client Error');
    },

    // Store data on the last 3 events that occurred
    logEvent: function(moduleName, eventName) {
        if (eventBuffer.length >= 3) {
            eventBuffer.splice(0, 1);
        }
        let now = new Date();
        let data = {
            date: now.toLocaleTimeString(),
            eventName: eventName,
            moduleName: moduleName
        };
        eventBuffer.push(data);
        logger.event(moduleName, eventName);
    },

    // Store data on the last 3 messages that the bot listened to for debug purposes
    logMessage: function(msg) {
        if (messageBuffer.length >= 3) {
            messageBuffer.splice(0, 1);
        }
        let now = new Date();
        let data = {
            date: now.toLocaleTimeString(),
            message: msg.content,
        };
        if (msg.channel.type === 'dm' || msg.channel.type === 'group') {
            data.server = 'DM';
        } else {
            data.server = msg.guild.name;
        }
        messageBuffer.push(data);
    }
};

// Super scary stuff, program in unlcean state and must end soonish
process.on('uncaughtException', (err) => {
    crash(err, 'Uncaught Exception');
});

// Will catch unhandled promise rejections that ride all the way to the top.
process.on('unhandledRejection', (reason) => {
    logger.warning(TAG, `Unhandled Rejection: ${reason}`);
});

// Compile a crash report and send it to the logger to be delivered
function crash(err, type) {
    module.exports.logEvent(TAG, 'crash');
    let now = new Date();
    let message = '[' + now.toLocaleTimeString() + '] ' + type + ' Crash';
    if (eventBuffer.length != 0) {
        message += '\n- Last Events:';
        for (let x in eventBuffer) {
            message += '\n- ' + '[' + eventBuffer[x].date + '] (' + eventBuffer[x].moduleName +
                ') ' + eventBuffer[x].eventName;
        }
    }
    if (messageBuffer.length != 0) {
        message += '\n- Last Messages Recieved:';
        for (let x in messageBuffer) {
            message += '\n- ' + '[' + messageBuffer[x].date + '] (' + messageBuffer[x].server +
                ') ' + messageBuffer[x].message;
        }
    }
    message += '\n- ' + err.stack;
    logger.error(TAG, message);
}
