const config = require('config');
const Transport = require('winston-transport');
const { TextChannel } = require('discord.js');

// const MESSAGE = Symbol.for('message');
const LEVEL = Symbol.for('level');

module.exports = class DiscordTransport extends Transport {
    /**
     * @param discordjsClient
     * @param discordLogQueue
     * @param opts
     */
    constructor({ discordjsClient, queueDiscordLogs }, opts = {}) {
        super(opts);

        this.channelId = opts.channelId || config.get('channels.mappings.digBotLog');

        this.client = discordjsClient;
        this.queue = queueDiscordLogs;

        // this.queue.pause();

        this.client.on('disconnect', () => {
            this.queue.pause();
            this.logchannel = null;
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

        // TODO: Should use the registered format, but colors allow for unwanted symbols
        this.queue.add({ message: `${info.timestamp} [${info.label}] ${info[LEVEL]}: ${info.message}` });

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
        // TODO: Escape backticks in message
        return `\`${message}\``;
    }
};