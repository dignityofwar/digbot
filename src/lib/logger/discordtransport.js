const config = require('config');
const Transport = require('winston-transport');
// const { TextChannel } = require('discord.js');
// const util = require('util');

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

        this.client.on('disconnect', () => { this.logchannel = null; });

        this.queue.process(this.process.bind(this));
    }

    /**
     * Adds new log to the queue
     *
     * @param info
     * @param callback
     */
    log(info, callback) {
        setImmediate(() => {
            this.emit('logged', info);
        });

        this.queue.add(info);

        callback();
    }

    /**
     * Processor for the log queue
     *
     * @param info
     * @return {Promise}
     */
    process({ data: info }) {
        return this.channel.send(this.format(info.MESSAGE));
    }

    /**
     * The channel that the bot should log to
     *
     * @return {TextChannel}
     */
    get channel() {
        // if (!this.logchannel) {
        return this.client.channels.get(this.channelId);
        // }

        // TODO: Validation that channel is a TextChannel
        // return this.logchannel;
    }

    /**
     * Formats the message to Markdown code syntax
     *
     * @param message
     * @return {string}
     */
    format(message) {
        // TODO: Escape backticks in message
        return `\`${message}\``;
    }
};
