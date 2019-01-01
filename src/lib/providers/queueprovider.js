const { asFunction } = require('awilix');
const Queue = require('bull');
const ServiceProvider = require('../core/serviceprovider');

module.exports = class LoggerProvider extends ServiceProvider {
    /**
     * Register any app dependency
     */
    register() {
        this.container.register('queueDiscordLogs', asFunction(() => new Queue('discord logs', 'redis://queue'))
            .singleton());
    }
};
