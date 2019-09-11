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
        logger().debug({
            message,
            label: mod,
        });
    },
    // General major info, alert developers but do not crash
    devAlert(mod, message) {
        logger().info({
            message,
            label: mod,
        });
    },
    event(mod, message) {
        logger().verbose({
            message,
            label: mod,
        });
    },
    // General information messages
    info(mod, message) {
        logger().info({
            message,
            label: mod,
        });
    },
    // The server can continue to run, however it's things we maybe should address
    warning(mod, message) {
        logger().warn({
            message,
            label: mod,
        });
    },
};
