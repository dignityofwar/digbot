//  Copyright © 2018 DIG Development team. All rights reserved.

'use strict';

// Logger module

/* eslint no-console: 0 */

const cliColor = require('cli-color');

const TAG = 'logger';
let alertChannel = null;
let debugs = true;
let testing = false;

module.exports = {
    // General status messages, e.g. Connections, Disconnections, uptime etc
    botStatus: function botStatus(mod, message) {
        const args = Array.prototype.slice.call(arguments, botStatus.length - 1);
        args[0] = `[STATUS] (${mod}) ${message}`;
        colorizeString(cliColor.green.bold, args);
    },
    // Errors that cannot be recovered, may cause damage, and the server MUST be stopped imediately
    critical: function critical(mod, message) {
        const args = Array.prototype.slice.call(arguments, critical.length - 1);
        args[0] = `[CRITICAL_ERROR] (${mod}) ${message}`;
        colorizeString(cliColor.red.bold, args);
        developeralert(mod, message, '[CRITICAL] ', true);
    },
    // General debug messages
    debug: function debug(mod, message) {
        if (debugs === false) { return; }
        const args = Array.prototype.slice.call(arguments, debug.length - 1);
        args[0] = `[DEBUG] (${mod}) ${message}`;
        colorizeString(blankFormat, args);
    },
    // General major info, alert developers but do not crash
    devAlert: function devAlert(mod, message) {
        const args = Array.prototype.slice.call(arguments, devAlert.length - 1);
        args[0] = `[INFO] (${mod}) ${message}`;
        colorizeString(cliColor.yellow.bold, args);
        developeralert(mod, message, '[INFO] ', false);
    },
    // Errors that need to be fixed, and the server should be stopped. Distinct from API errors
    error: function error(mod, message) {
        const args = Array.prototype.slice.call(arguments, error.length - 1);
        args[0] = `[ERROR] (${mod}) ${message}`;
        colorizeString(cliColor.red.bold, args);
        developeralert(mod, message, '[ERROR] ', true);
    },
    event: function event(mod, message) {
        const args = Array.prototype.slice.call(arguments, event.length - 1);
        args[0] = `[EVENT] (${mod}) ${message}`;
        colorizeString(cliColor.green, args);
    },
    // General information messages
    info: function info(mod, message) {
        const args = Array.prototype.slice.call(arguments, info.length - 1);
        args[0] = `[INFO] (${mod}) ${message}`;
        colorizeString(cliColor.blue, args);
    },
    // Set channel the bot will alert on errors on bot start
    setChannel(channel) {
        alertChannel = channel;
    },
    setDebugs(option) {
        debugs = option;
    },
    setTesting() {
        testing = true;
    },
    // The server can continue to run, however it's things we maybe should address
    warning: function warning(mod, message) {
        const args = Array.prototype.slice.call(arguments, warning.length - 1);
        args[0] = `[WARNING] (${mod}) ${message}`;
        colorizeString(cliColor.yellow, args);
        developeralert(mod, message, '[WARNING] ', false);
    },
};

function blankFormat(arg) {
    return arg;
}

function colorizeString(colorFun, args) {
    args[0] = `[${formatTimestamp()}] ${colorFun(args[0])}`;
    console.log(...args);
}

// Alert developers, used to end process upon crash
function developeralert(mod, message, type, crash) {
    // Synchronous crash if testing
    if (testing) {
        if (crash) {
            console.log(`[CRITICAL_ERROR] (${TAG}) alertChannel null, crashing`);
            process.exit(1);
        }
        return;
    }
    // Synchronous crash if no channel to alert
    if (alertChannel === null) {
        if (crash) {
            console.log(`[CRITICAL_ERROR] (${TAG}) alertChannel null, crashing`);
            process.exit(1);
        }
        return;
    }
    const alert = `${type}'(${mod}) ${message}`;
    // Asynchronous crash if a message should be sent, crash on message success or 10 sec timeout
    if (crash) {
        console.log('CRASHING');
        setTimeout(() => {
            console.log(`[CRITICAL_ERROR] (${TAG}) Crash promise failed to resolve. Restarting`);
            process.exit(1);
        }, 10000);
    }
    if (alertChannel !== null) {
        alertChannel.sendMessage(`\`\`\`${formatTimestamp()} ${alert}\`\`\``,
            { split: { prepend: '```...', append: '...```' } })
            .then(() => {
                if (crash) {
                    module.exports.info(TAG, 'Alerted developers, restarting');
                    process.exit(1);
                } else {
                    // module.exports.info(TAG, 'Alerted developers');
                }
            })
            .catch((err) => {
                module.exports.info(TAG, `Failed attempt to alert developers ${err}, restarting`);
                if (crash) { process.exit(1); }
            });
    }
}

function formatTimestamp() {
    const currentdate = new Date();
    return currentdate.toLocaleTimeString();
}
