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

        this.client = discordjsClient;
        this.queue = discordTransportQueue;

        this.channelID = opts.channelID;

        this.registerEvents();
    }

    /**
     * TODO: Probably not the best place for this
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
            channel: this.channelID,
        }, { attempts: 3 });

        callback();
    }

    /**
     * Formats the message to Markdown code syntax
     *
     * @param message
     * @param level
     * @return {{embed: {color: Number, description: *}}}
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
     * Maps a level to a color in decimal notation
     *
     * @param level
     * @return {Number}
     */
    getColor(level) {
        return get({
            error: 15073281, // Red
            warn: 16763904, // Yellow
            info: 3394611, // Green
            verbose: 52479, // Light Blue
            debug: 230, // Indigo
        }, level, 808080);
    }
};
