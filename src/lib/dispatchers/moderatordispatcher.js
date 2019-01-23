const Dispatcher = require('../core/dispatcher');

module.exports = class ModeratorDispatcher extends Dispatcher {
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
    }

    /**
     *
     * @return {Promise<void>}
     */
    async stop() {
    }
};
