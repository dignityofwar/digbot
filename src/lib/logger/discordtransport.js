const config = require('config');
const Transport = require('winston-transport');
const { TextChannel } = require('discord.js');

const MESSAGE = Symbol.for('message');

module.exports = class DiscordTransport extends Transport {
    /**
     * @param discordjsClient
     * @param discordTransportQueue
     * @param process
     * @param opts
     */
    constructor({ discordjsClient, discordTransportQueue, opts = {} }) {
        super(opts);

        this.channelId = opts.channelId || config.get('channels.mappings.digBotLog');

        this.client = discordjsClient;
        this.queue = discordTransportQueue;

        // TODO: Start and stop the queue when there is no connection to discord
        // this.queue.pause();

        this.client.on('disconnect', () => {
            this.queue.pause();
            this.logchannel = null;
        });

        process.on('SIGTERM', () => {
            this.queue.pause();
        });

        process.on('SIGINT', () => {
            this.queue.pause();
        });

        this.client.on('ready', () => {
            if (this.channel instanceof TextChannel) {
                this.queue.resume();
            }
        });

        this.queue.process(this.process.bind(this));
    }

    /**
     * Adds new log to the queue
     *
     * @param info
     * @param callback
     */
    log(info, callback) {
        setImmediate(() => this.emit('logged', info));

        this.queue.add({ message: this.markdownCodeFormat(info[MESSAGE]) });

        callback();
    }

    /**
     * Processor for the log queue
     *
     * @param info
     * @return {Promise}
     */
    process({ data: { message } }) {
        return this.channel.send(this.markdownCodeFormat(message));
    }

    /**
     * The channel that the bot should log to
     *
     * @return {TextChannel}
     */
    get channel() {
        if (!this.logchannel) {
            this.logchannel = this.client.channels.get(this.channelId);
        }

        // TODO: Validation that channel is a TextChannel
        return this.logchannel;
    }

    /**
     * Formats the message to Markdown code syntax
     *
     * @param message
     * @return {string}
     */
    markdownCodeFormat(message) {
        // TODO: To allow the use of backticks in logs, the message should be wrapped in 2 backticks
        //  For some reason `\`\`${message}\`\`` doesn't work
        return `\`${message}\``;
    }
};
