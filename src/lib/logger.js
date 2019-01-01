//  Copyright © 2018 DIG Development team. All rights reserved.

// Logger module
// TODO: Marked for removal

// const TAG = 'logger';

// let alertChannel = null;
// let cliColor = require('cli-color');
// let debugs = true;
// let testing = false;

// TODO: Workaround, logger should be injected. Only here for legacy support.
/* eslint global-require: 0 */
const logger = () => require('../bootstrap')
    .resolve('logger');

module.exports = {
    // General status messages, e.g. Connections, Disconnections, uptime etc
    botStatus: function botStatus(mod, message) {
        // var args = Array.prototype.slice.call(arguments, botStatus.length - 1);
        // args[0] = '[STATUS] ' + '(' + mod + ') ' + message;
        // colorizeString(cliColor.green.bold, args);
        logger().log('info', {
            message,
            label: 'status',
        });
    },
    // Errors that cannot be recovered, may cause damage, and the server MUST be stopped imediately
    // TODO: Ready to be removed, used by discord/discordbot.js
    critical: function critical(mod, message) {
        // var args = Array.prototype.slice.call(arguments, critical.length - 1);
        // args[0] = '[CRITICAL_ERROR] ' + '(' + mod + ') ' + message;
        // colorizeString(cliColor.red.bold, args);
        // developeralert(mod, mesage, '[CRITICAL] ', true);
    },
    // General debug messages
    debug: function debug(mod, message) {
        // if (debugs === false) { return; }
        // var args = Array.prototype.slice.call(arguments, debug.length - 1);
        // args[0] = '[DEBUG] ' + '(' + mod + ') ' + message;
        // colorizeString(blankFormat, args);
        logger().log('debug', {
            message,
            label: mod,
        });
    },
    // General major info, alert developers but do not crash
    devAlert: function devAlert(mod, message) {
        // var args = Array.prototype.slice.call(arguments, devAlert.length - 1);
        // args[0] = '[INFO] ' + '(' + mod + ') ' + message;
        // colorizeString(cliColor.yellow.bold, args);
        // developeralert(mod, message, '[INFO] ', false);
        logger().log('info', {
            message,
            label: mod,
        });
    },
    // Errors that need to be fixed, and the server should be stopped. Distinct from API errors
    // TODO: Should be deprecated, crashing should be done by trowing errors and then be caught by the logger
    error: function error(mod, message) {
        // var args = Array.prototype.slice.call(arguments, error.length - 1);
        // args[0] = '[ERROR] ' + '(' + mod + ') ' + message;
        // colorizeString(cliColor.red.bold, args);
        // developeralert(mod, message, '[ERROR] ', true);
        logger().log('error', {
            message,
            label: mod,
        });
        process.exit(1);
    },
    event: function event(mod, message) {
        // var args = Array.prototype.slice.call(arguments, event.length - 1);
        // args[0] = '[EVENT] ' + '(' + mod + ') ' + message;
        // colorizeString(cliColor.green, args);
        logger().log('verbose', {
            message,
            label: mod,
        });
    },
    // General information messages
    info: function info(mod, message) {
        // var args = Array.prototype.slice.call(arguments, info.length - 1);
        // args[0] = '[INFO] ' + '(' + mod + ') ' + message;
        // colorizeString(cliColor.blue, args);
        logger().log('info', {
            message,
            label: mod,
        });
    },
    // Set channel the bot will alert on errors on bot start
    setChannel: function (channel) {
        // alertChannel = channel;
    },
    setDebugs: function (option) {
        // debugs = option;
    },
    setTesting: function () {
        // testing = true;
    },
    // The server can continue to run, however it's things we maybe should address
    warning: function warning(mod, message) {
        // var args = Array.prototype.slice.call(arguments, warning.length - 1);
        // args[0] = '[WARNING] ' + '(' + mod + ') ' + message;
        // colorizeString(cliColor.yellow, args);
        // developeralert(mod, message, '[WARNING] ', false);
        logger().log('warn', {
            message,
            label: mod,
        });
    },
};

// function blankFormat(arg) {
//     return arg;
// }
//
// function colorizeString(colorFun, args) {
//     args[0] = '[' + formatTimestamp() + '] ' + colorFun(args[0]);
//     console.log.apply(console, args);
// }

// Alert developers, used to end process upon crash
// function developeralert(mod, message, type, crash) {
//     // Synchronous crash if testing
//     if (testing) {
//         if (crash) {
//             console.log('[CRITICAL_ERROR] ' + '(' + TAG + ') alertChannel null, crashing');
//             process.exit(1);
//         }
//         return;
//     }
//     // Synchronous crash if no channel to alert
//     if (alertChannel === null) {
//         if (crash) {
//             console.log('[CRITICAL_ERROR] ' + '(' + TAG + ') alertChannel null, crashing');
//             process.exit(1);
//         }
//         return;
//     }
//     let alert = type + '(' + mod + ') ' + message;
//     // Asynchronous crash if a message should be sent, crash on message success or 10 sec timeout
//     if (crash) {
//         console.log('CRASHING');
//         setTimeout(function() {
//             console.log('[CRITICAL_ERROR] ' + '(' + TAG + ') Crash promise failed to resolve. ' +
//                 'Restarting');
//             process.exit(1);
//         }, 10000);
//     }
//     if (alertChannel !== null) {
//         alertChannel.sendMessage('```' + formatTimestamp() + ' ' + alert + '```', {split: {prepend: '```...', append: '...```'}})
//             .then(() => {
//                 if (crash) {
//                     module.exports.info(TAG, 'Alerted developers, restarting');
//                     process.exit(1);
//                 } else {
//                     // module.exports.info(TAG, 'Alerted developers');
//                 }
//             })
//             .catch(err => {
//                 module.exports.info(TAG, `Failed attempt to alert developers ${err}, restarting`);
//                 if (crash) {process.exit(1);}
//             });
//     }
// }

// function formatTimestamp() {
//     let currentdate = new Date();
//     return currentdate.toLocaleTimeString();
// }
