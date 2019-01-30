const config = require('config');
const { asFunction } = require('awilix');
const Queue = require('bull');
const Redis = require('ioredis');
const ServiceProvider = require('../core/serviceprovider');

module.exports = class QueueProvider extends ServiceProvider {
    /**
     * Register any app dependency
     */
    register() {
        this.container.register('redisClient',
            asFunction(() => new Redis(config.get('services.queue.redis_url')))
                .singleton()
                .disposer(redis => redis.disconnect().catch(() => {})));

        this.container.register('discordTransportQueue',
            asFunction(() => new Queue('discord logs', config.get('services.queue.redis_url')))
                .singleton()
                .disposer(queue => queue.close().catch(() => {})));

        this.container.register('triviaCommandQueue',
            asFunction(() => new Queue('trivia', config.get('services.queue.redis_url')))
                .singleton()
                .disposer(queue => queue.close().catch(() => {})));
    }
};
