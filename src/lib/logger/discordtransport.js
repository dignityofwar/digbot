const config = require('config');
const Transport = require('winston-transport');
// const { TextChannel } = require('discord.js');

const MESSAGE = Symbol.for('message');

module.exports = class DiscordTransport extends Transport {
    /**
     * @param discordjsClient
     * @param discordTransportQueue
     * @param opts
     */
    constructor({ discordjsClient, discordTransportQueue, opts = {} }) {
        super(opts);

        this.channelId = opts.channelId || config.get('channels.mappings.digBotLog');

        this.client = discordjsClient;
        this.queue = discordTransportQueue;

        // this.queue.pause();

        this.registerEvents();

        this.queue.process(this.process.bind(this));
    }

    /**
     *
     */
    registerEvents() {
        this.client.on('disconnect', () => {
            this.queue.pause();
        });

        this.client.on('ready', () => {
            this.queue.resume();
        });
    }

    /**
     * Adds new log to the queue
     *
     * @param info
     * @param callback
     */
    log(info, callback) {
        setImmediate(() => this.emit('logged', info));

        this.queue.add({ message: info[MESSAGE] }, { attempts: 3 });

        callback();
    }

    /**
     * Processor for the log queue
     *
     * @param info
     * @return {Promise}
     */
    async process({ data: { message } }) {
        // TODO: Solution to a problem that isn't a problem? Fuck Bull with their stupid circular structure error
        await this.channel.send(this.markdownCodeFormat(message));
        return true;
    }

    /**
     * The channel that the bot should log to
     *
     * @return {TextChannel}
     */
    get channel() {
        return this.client.channels.get(this.channelId);
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
