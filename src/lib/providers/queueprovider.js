const config = require('config');
const { asFunction } = require('awilix');
const Queue = require('bull');
const ServiceProvider = require('../core/serviceprovider');

module.exports = class LoggerProvider extends ServiceProvider {
    /**
     * Register any app dependency
     */
    register() {
        this.container.register('discordTransportQueue',
            asFunction(() => new Queue('discord logs', config.get('services.queue.redis_url')))
                .singleton()
                .disposer(queue => queue.close()));
    }
};
