const EventEmitter = require('events');

module.exports = class Dispatcher extends EventEmitter {
    /**
     *
     */
    constructor() {
        super();

        this.registeredListeners = [];
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

    registerListenersTo(emitter, listeners) {
        for (const [event, listener] of Object.entries(listeners)) {
            emitter.on(event, listener);

            this.registeredListeners.push([emitter, event, listener]);
        }
    }

    unregisterListenersFromAll() {
        for (const [emitter, event, listener] of this.registeredListeners) {
            emitter.off(event, listener);
        }

        this.registeredListeners = [];
    }
};
