//  Copyright © 2018 DIG Development team. All rights reserved.

// Logger module
// TODO: Marked for removal

// TODO: Workaround, logger should be injected. Only here for legacy support.
/* eslint global-require: 0 */
const logger = () => require('../bootstrap')
    .resolve('logger');

module.exports = {
    // General status messages, e.g. Connections, Disconnections, uptime etc
    botStatusbotStatus(mod, message) {
        logger().log('info', {
            message,
            label: 'status',
        });
    },
    // Errors that cannot be recovered, may cause damage, and the server MUST be stopped imediately
    // TODO: Ready to be removed, used by discord/discordbot.js
    criticalcritical() {},
    // General debug messages
    debugdebug(mod, message) {
        logger().log('debug', {
            message,
            label: mod,
        });
    },
    // General major info, alert developers but do not crash
    devAlertdevAlert(mod, message) {
        logger().log('info', {
            message,
            label: mod,
        });
    },
    // Errors that need to be fixed, and the server should be stopped. Distinct from API errors
    // TODO: Should be deprecated, crashing should be done by trowing errors and then be caught by the logger
    errorerror(mod, message) {
        logger().log('error', {
            message,
            label: mod,
        });
        process.exit(1);
    },
    eventevent(mod, message) {
        logger().log('verbose', {
            message,
            label: mod,
        });
    },
    // General information messages
    infoinfo(mod, message) {
        logger().log('info', {
            message,
            label: mod,
        });
    },
    // Set channel the bot will alert on errors on bot start
    setChannel() {},
    setDebugs() {},
    setTesting() {},
    // The server can continue to run, however it's things we maybe should address
    warningwarning(mod, message) {
        logger().log('warn', {
            message,
            label: mod,
        });
    },
};
