//  Copyright © 2018 DIG Development team. All rights reserved.

// Checks cpu and memory usage

const config = require('config');
const { cpuUsage } = require('os-utils');
const crashHandler = require('../crash-handling.js');
const logger = require('../logger.js');

const TAG = 'Performance';

module.exports = {
    execute() {
        crashHandler.logEvent(TAG, 'execute');
        Promise.all([
            this.getCpu(),
            this.getMemory(),
        ])
            .then(([cpu, memory]) => {
                if (config.get('showPerfStats') === true) {
                    logger.debug(TAG, `CPU: ${cpu}`);
                    logger.debug(TAG, `MEM: ${memory}`);
                }

                if (cpu > config.get('general.cpuNotificationLimit')) {
                    logger.warning(TAG,
                        `CPU usage is above ${config.get('general.cpuNotificationLimit')}! Current CPU: ${cpu}%`);
                }
                if (memory > config.get('general.memoryNotificationLimit')) {
                    logger.warning(TAG,
                        `Memory usage is above ${config.get(
                            'general.memoryNotificationLimit')}MB! Current MEM: ${memory}MB`);
                }
            });
    },

    getCpu() {
        return new Promise((resolve) => {
            // TODO: Maybe get average? We don't need a dependency or promise for that
            cpuUsage((result) => {
                resolve(result.toFixed(2));
            });
        });
    },

    getMemory() {
        return new Promise((resolve) => {
            // TODO: Maybe return rss and heap for better comparison of memory usage across different os's
            resolve((Math.round(process.memoryUsage().rss) / 1048576).toFixed(2));
        });
    },
};
