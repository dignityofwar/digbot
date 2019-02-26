const Dispatcher = require('../core/dispatcher');

module.exports = class AntiSpamDispatcher extends Dispatcher {
    /**
     *
     * @param discordjsClient
     */
    constructor({ discordjsClient }) {
        super();

        this.client = discordjsClient;

        this.listener = this.handler.bind(this);
    }

    /**
     *
     * @return {Promise<void>}
     */
    async start() {
        this.client.on('message', this.listener);
    }

    /**
     *
     * @return {Promise<void>}
     */
    async stop() {
        this.client.off('message', this.listener);
    }

    /**
     *
     * @param message
     */
    handler() {}
};
