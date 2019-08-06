const config = require('config');
const { RESOLVER } = require('awilix');
const Queue = require('bull');

module.exports = class DiscordMessageQueue extends Queue {
    constructor({ discordjsClient, opts: { redisOpts } }) {
        super('discord messages', redisOpts, {
            defaultJobOptions: {
                attempts: 3,
            },
        });

        this.discordclient = discordjsClient;

        this.registerEvents();

        this.process('send', this.workerSend.bind(this));
        this.process('update', this.workerUpdate.bind(this));
    }

    /**
     * Queue is started immediately, so a Discord connection should be already established
     */
    registerEvents() {
        this.discordclient.on('disconnect', () => {
            this.pause();
        });

        this.discordclient.on('ready', () => {
            this.resume();
        });
    }

    /**
     * Worker for sending a new message
     *
     * @param info
     * @return {Promise}
     */
    workerSend({ data: { content, channel } }) {
        return this.discordclient.channels.get(channel).send(content).then(({ id }) => id);
    }

    /**
     * Worker for updating an existing message
     *
     * @param content
     * @param channel
     * @param message
     * @return {Promise<string>}
     */
    async workerUpdate({ data: { content, channel, message } }) {
        return (await this.discordclient.channels.get(channel).fetchMessage(message)).edit(content).then(({ id }) => id);
    }

    /**
     * Add a new job for sending a new message to the queue
     *
     * @param content
     * @param channel
     * @param jobOpts
     * @return {*}
     */
    sendMessage(content, channel, jobOpts = {}) {
        return this.add('send', {
            content,
            channel,
        }, jobOpts);
    }

    /**
     * Add a new job for updating an existing message
     *
     * @param content
     * @param channel
     * @param message
     * @param jobOpts
     * @return {*}
     */
    updateMessage(content, channel, message, jobOpts = {}) {
        return this.add('update', {
            content,
            channel,
            message,
        }, jobOpts);
    }
};

module.exports[RESOLVER] = {
    injector: () => ({
        opts: {
            redisOpts: config.get('services.queue.redis_url'),
        },
    }),
};
