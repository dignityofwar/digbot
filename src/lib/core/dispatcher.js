const EventEmitter = require('events');

module.exports = class Dispatcher extends EventEmitter {
    /**
     *
     */
    constructor() {
        super();

        // this.restart = 'always';
    }

    /**
     *
     * @return {Promise<void>}
     */
    async start() {}

    /**
     *
     * @return {Promise<void>}
     */
    async stop() {}
};
