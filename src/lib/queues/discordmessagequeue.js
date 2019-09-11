const config = require('config');
const { RESOLVER } = require('awilix');
const Queue = require('bull');
const { RichEmbed } = require('discord.js');

const [SEND_JOB, UPDATE_JOB] = ['send', 'update'];

module.exports = class DiscordMessageQueue extends Queue {
    constructor({ logger, discordjsClient, opts: { redisOpts } }) {
        super('discord messages', redisOpts, {
            defaultJobOptions: {
                attempts: 3,
            },
        });

        this.discordclient = discordjsClient;

        this.registerEvents();

        this.process(SEND_JOB, this.workerSend.bind(this));
        this.process(UPDATE_JOB, this.workerUpdate.bind(this));

        this.on('failed', (job, err) => logger.warn(`Discord Message Queue job failed: ${err}`));
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
        if (content instanceof Object) {
            content = new RichEmbed(content);
        }

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
        if (content instanceof Object) {
            content = new RichEmbed(content);
        }

        return (await this.discordclient.channels.get(channel).fetchMessage(message)).edit(content)
            .then(({ id }) => id);
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
        return this.add(SEND_JOB, {
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
        return this.add(UPDATE_JOB, {
            content,
            channel,
            message,
        }, jobOpts);
    }
};

module.exports[RESOLVER] = {
    injector: () => ({
        opts: {
            redisOpts: config.get('database.redis.url'),
        },
    }),
};
