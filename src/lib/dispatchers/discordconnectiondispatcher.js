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
    }

    /**
     *
     * @return {Promise<void>}
     */
    async start() {
        this.registerListenersTo(this.client, {
            disconnect: this.handler.bind(this),
        });
    }

    /**
     *
     * @return {Promise<void>}
     */
    async stop() {
        this.unregisterListenersFromAll();
    }

    /**
     */
    handler() {
        // Reconnects when connection is lost
        this.client.login(config.get('token'));
    }
};
