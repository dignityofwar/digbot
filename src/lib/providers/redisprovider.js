const config = require('config');
const { asFunction } = require('awilix');
const Redis = require('ioredis');
const ServiceProvider = require('../foundation/serviceprovider');

module.exports = class QueueProvider extends ServiceProvider {
    /**
     * Register any app dependency
     */
    register() {
        this.container.register('redisClient',
            asFunction(() => new Redis(config.get('database.redis.url')))
                .singleton()
                .disposer(redis => redis.disconnect()));
    }
};
