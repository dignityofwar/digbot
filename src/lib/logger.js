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
        const log = `[STATUS] (${mod}) ${message}`;
        colorizeString(cliColor.green.bold, log);
    },
    // Errors that cannot be recovered, may cause damage, and the server MUST be stopped imediately
    critical: function critical(mod, message) {
        colorizeString(cliColor.red.bold, `[CRITICAL_ERROR] (${mod}) ${message}`);
        developeralert(mod, message, '[CRITICAL] ', true);
    },
    // General debug messages
    debug: function debug(mod, message) {
        if (debugs === false) { return; }
        colorizeString(blankFormat, `[DEBUG] (${mod}) ${message}`);
    },
    // General major info, alert developers but do not crash
    devAlert: function devAlert(mod, message) {
        colorizeString(cliColor.yellow.bold, `[INFO] (${mod}) ${message}`);
        developeralert(mod, message, '[INFO] ', false);
    },
    // Errors that need to be fixed, and the server should be stopped. Distinct from API errors
    error: function error(mod, message) {
        colorizeString(cliColor.red.bold, `[ERROR] (${mod}) ${message}`);
        developeralert(mod, message, '[ERROR] ', true);
    },
    event: function event(mod, message) {
        colorizeString(cliColor.green, `[EVENT] (${mod}) ${message}`);
    },
    // General information messages
    info: function info(mod, message) {
        colorizeString(cliColor.blue, `[INFO] (${mod}) ${message}`);
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
        colorizeString(cliColor.yellow, `[WARNING] (${mod}) ${message}`);
        developeralert(mod, message, '[WARNING] ', false);
    },
};

function blankFormat(arg) {
    return arg;
}

function colorizeString(colorFun, ...args) {
    const arguements = args;
    arguements[0] = `[${formatTimestamp()}] ${colorFun(args[0])}`;
    console.log(...arguements);
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
