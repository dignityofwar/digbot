const Transport = require('winston-transport');

const MESSAGE = Symbol.for('message');

module.exports = class DiscordTransport extends Transport {
    /**
     * @param queuesDiscordmessagequeue
     * @param opts
     */
    constructor({ queuesDiscordmessagequeue, opts = {} }) {
        super(opts);

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

        this.queue.send(info[MESSAGE], this.channel);

        callback();
    }
};
