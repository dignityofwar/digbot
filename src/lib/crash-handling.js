// Handles crashes by compiling crash reports and sending them to console/dev channel

const logger = require('./logger.js');

module.exports = {
    // Store data on the last 3 events that occurred
    logEvent(moduleName, eventName) {
        logger.event(moduleName, eventName);
    },
};
