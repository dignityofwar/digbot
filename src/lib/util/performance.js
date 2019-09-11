const { cpuUsage } = require('os-utils');

module.exports = {
    getCpu() {
        return new Promise((resolve) => {
            // TODO: Maybe get average? We don't need a dependency or promise for that
            cpuUsage((result) => {
                resolve(result.toFixed(2));
            });
        });
    },

    async getMemory() {
        // TODO: Maybe return rss and heap for better comparison of memory usage across different os's
        return (Math.round(process.memoryUsage().rss) / 1048576).toFixed(2);
    },
};
