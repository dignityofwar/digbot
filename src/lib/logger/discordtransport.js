const config = require('config');
const { get } = require('lodash');
const Transport = require('winston-transport');

const MESSAGE = Symbol.for('message');
const LEVEL = Symbol.for('level');

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

        this.queue.add({
            message: info[MESSAGE],
            level: info[LEVEL],
        }, { attempts: 3 });

        callback();
    }

    /**
     * Processor for the log queue
     *
     * @param info
     * @return {Promise}
     */
    async process({ data: log }) {
        // TODO: Solution to a problem that isn't a problem? Fuck Bull with their stupid circular structure errors
        await this.channel.send(this.formatLog(log));
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
    formatLog({ message, level }) {
        return {
            embed: {
                description: message,
                color: this.getColor(level),
            },
        };
    }

    /**
     * @param level
     * @return {Number}
     */
    getColor(level) {
        return get({
            error: 15073280, // Red
            warn: 16763904, // Yellow
            info: 3394611, // Green
            verbose: 52479, // Light Blue
            debug: 230, // Indigo
        }, level, 808080);
    }
};
