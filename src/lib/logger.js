//  Copyright © 2018 DIG Development team. All rights reserved.

// Logger module
// TODO: Marked for removal

// TODO: Workaround, logger should be injected. Only here for legacy support.
/* eslint global-require: 0 */
const logger = () => require('../bootstrap')
    .resolve('logger');

module.exports = {
    // General debug messages
    debug(mod, message) {
        logger().log('debug', {
            message,
            label: mod,
        });
    },
    // General major info, alert developers but do not crash
    devAlert(mod, message) {
        logger().log('info', {
            message,
            label: mod,
        });
    },
    // Errors that need to be fixed, and the server should be stopped. Distinct from API errors
    // TODO: Should be deprecated, crashing should be done by trowing errors and then be caught by the logger
    error(mod, message) {
        logger().log('error', {
            message,
            label: mod,
        });
        process.exit(1);
    },
    event(mod, message) {
        logger().log('verbose', {
            message,
            label: mod,
        });
    },
    // General information messages
    info(mod, message) {
        logger().log('info', {
            message,
            label: mod,
        });
    },
    // The server can continue to run, however it's things we maybe should address
    warning(mod, message) {
        logger().log('warn', {
            message,
            label: mod,
        });
    },
};
