const EventEmitter = require('events');

/* TODO: This class should be responsible for:
*   - Keeping a good connection to discord
*   - Propagating all client events
*   - Sub processes will depend on this(commands, management, etc)
*
* This class will be there to replace the client when a disconnect happens, so no restart is necessary.
* */
module.exports = class DigBot extends EventEmitter {
    /**
     *
     * @param discordjsClient
     */
    constructor({ discordjsClient }) {
        super();

        this.this.client = discordjsClient;
    }
};
