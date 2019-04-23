const config = require('config');
const { asFunction } = require('awilix');
const Queue = require('bull');
const Redis = require('ioredis');
const ServiceProvider = require('../foundation/serviceprovider');

module.exports = class QueueProvider extends ServiceProvider {
    /**
     * Register any app dependency
     */
    register() {
        this.container.register('redisClient',
            asFunction(() => new Redis(config.get('services.queue.redis_url')))
                .singleton()
                .disposer(redis => redis.disconnect()));

        this.container.register('discordTransportQueue',
            asFunction(({ processorsDiscordlogprocessor }) => newQueueWithProcessor('discord logs',
                processorsDiscordlogprocessor))
                .singleton()
                .disposer(queue => queue.close().catch(() => {})));

        this.container.register('triviaCommandQueue',
            asFunction(({ processorsTriviacommandprocessor }) => newQueueWithProcessor('trivia',
                processorsTriviacommandprocessor))
                .singleton()
                .disposer(queue => queue.close().catch(() => {})));

        this.container.register('muteModeratorQueue',
            asFunction(({ processorsMutemoderatorprocessor }) => newQueueWithProcessor('mute moderator',
                processorsMutemoderatorprocessor))
                .singleton()
                .disposer(queue => queue.close().catch(() => {})));
    }
};

/**
 * Generates a BullJS queue and registers a processor to it.
 * @param queueName
 * @param processor
 * @return {Queue}
 */
function newQueueWithProcessor(queueName, processor) {
    const queue = new Queue(queueName, config.get('services.queue.redis_url'));

    queue.process(processor.processor.bind(processor));

    return queue;
}
