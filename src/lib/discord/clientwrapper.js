const EventEmitter = require('events');
const config = require('config');

/* TODO: This class should be responsible for:
*   - Keeping a good connection to discord
*   - Propagating all client events
*   - Sub processes will depend on this(commands, management, etc)
*
* This class will be there to replace the client when a disconnect happens, so no restart is necessary.
* */
module.exports = class DiscordClientWrapper extends EventEmitter {
    /**
     *
     * @param discordjsClient
     */
    constructor({ container, discordjsClient }) {
        super();

        this.client = discordjsClient;
        this.container = container;

        this.on('newListener', this.newListener.bind(this));

        this.client.on('disconnect', this.replaceClient.bind(this));
    }

    /**
     * On new unique listener name create a propagator that listens on the client
     *
     * @param eventName
     */
    newListener(eventName) {
        if (!this.eventNames()
            .find(name => name === eventName)) {
            this.eventPropagator(eventName);
        }
    }

    /**
     * Creates a event propagator from the client
     *
     * @param eventName
     */
    eventPropagator(eventName) {
        this.client.on(eventName, (...args) => this.client.emit(eventName, ...args));
    }

    /**
     * Replaces the discord.js Client
     */
    replaceClient() {
        this.client.removeAllListeners(); // Make sure that the garbage collector takes care of this filth
        this.client = this.container.resolve('discordjsClient');

        for (const eventName of this.eventNames()) {
            this.eventPropagator(eventName);
        }

        this.client.login(config.get('token'));
    }
};
