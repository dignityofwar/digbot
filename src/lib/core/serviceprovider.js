const EventEmitter = require('events');

module.exports = class ServiceProvider extends EventEmitter {
    /**
     * @param app
     */
    constructor({ container }) {
        super();

        this.container = container;
    }

    /**
     * Register any app dependency
     */
    register() {}

    /**
     * Boots any dependency
     *
     * @return {Promise<void>}
     */
    async boot() {}
};
