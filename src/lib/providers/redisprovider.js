const config = require('config');
const { asFunction } = require('awilix');
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
                .disposer(redis => redis.quit().catch(() => {})));
    }
};
