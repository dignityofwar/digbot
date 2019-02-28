const config = require('config');
const Dispatcher = require('../foundation/dispatcher');

module.exports = class DiscordconnectionDispatcher extends Dispatcher {
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
        this.client.on('disconnect', this.listener);
    }

    /**
     *
     * @return {Promise<void>}
     */
    async stop() {
        this.client.off('disconnect', this.listener);
    }

    /**
     */
    handler() {
        // Reconnects when connection is lost
        this.client.login(config.get('token'));
    }
};
