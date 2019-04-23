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

        // this.queue.pause();

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
        }, { attempts: 3 });

        callback();
    }
};
