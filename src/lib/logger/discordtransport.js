const { get } = require('lodash');
const Transport = require('winston-transport');

const MESSAGE = Symbol.for('message');
const LEVEL = Symbol.for('level');

module.exports = class DiscordTransport extends Transport {
    /**
     * @param discordjsClient
     * @param queuesDiscordmessagequeue
     * @param opts
     */
    constructor({ discordjsClient, queuesDiscordmessagequeue, opts = {} }) {
        super(opts);

        this.client = discordjsClient;
        this.queue = queuesDiscordmessagequeue;

        this.channel = opts.channelID;
    }

    /**
     * Adds new log to the queue
     *
     * @param info
     * @param callback
     */
    log(info, callback) {
        setImmediate(() => this.emit('logged', info));

        console.log(info[MESSAGE]);
        const content = {
            embed: {
                description: info[MESSAGE],
                color: this.getColor(info[LEVEL]),
            },
        };

        this.queue.sendMessage(content, this.channel);

        callback();
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
