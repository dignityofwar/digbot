//  Copyright © 2018 DIG Development team. All rights reserved.

'use strict';

// Checks cpu and memory usage

const config = require('config');
const crashHandler = require('../crash-handling.js');
const logger = require('../logger.js');
const TAG = 'Performance';
const usage = require('usage');
let pid;

module.exports = {
    // Set PID
    ready: function() {
        pid = process.pid;
    },

    execute: function() {
        crashHandler.logEvent(TAG, 'execute');
        let promises = Promise.all([
            this.getCpu(),
            this.getMemory()
        ]);
        promises.then(function(result) {
            if (config.get('showPerfStats') === true) {
                logger.debug(TAG, `CPU: ${result[0]}`);
                logger.debug(TAG, `MEM: ${result[1]}`);
            }

            if (result[0] > config.get('general.cpuNotificationLimit')) {
                logger.warning(TAG, `CPU usage is above ${config.get('general.cpuNotificationLimit')}! ` +
                `Current CPU: ${result[0]}%`);
            }
            if (result[1] > config.get('general.memoryNotificationLimit')) {
                logger.warning(TAG, `Memory usage is above ${config.get('general.memoryNotificationLimit')}MB! ` +
                `Current MEM: ${result[1]}MB`);
            }
        });
    },

    getCpu: function() {
        return new Promise(function(resolve, reject) {
            usage.lookup(pid, function(err, result) {
                if (err) {
                    logger.warning(TAG, `Usage CPU lookup failed! Error: ${err}`);
                    reject();
                    return;
                }
                usage.clearHistory(pid);
                resolve(result.cpu.toFixed(2));
            });
        });
    },

    getMemory: function() {
        return new Promise(function(resolve, reject) {
            usage.lookup(pid, function(err, result) {
                if (err) {
                    logger.warning(TAG, `Usage memory lookup failed! Error: ${err}`);
                    reject();
                    return;
                }
                usage.clearHistory(pid);
                let mem = Math.round(result.memoryInfo.rss) / 1024 / 1024;
                resolve(mem.toFixed(2));
            });
        });
    }
};
