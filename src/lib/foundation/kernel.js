const EventEmitter = require('events');

const LoadModules = require('./bootstrappers/loadmodules');
const RegisterProviders = require('./bootstrappers/registerproviders');
const BootProviders = require('./bootstrappers/bootproviders');

module.exports = class Kernel extends EventEmitter {
    /**
     * @param app
     */
    constructor({ app }) {
        super();

        this.app = app;

        this.dispatchers = [];
    }

    /**
     * Bootstraps and starts the bot
     */
    async run() {
        try {
            await this.bootstrap();

            await this.startDispatchers();
        } catch (e) {
            // TODO: Errors are not printed to the console, probably because the logger is not initialised
            console.log(e instanceof Error ? e.stack : e.toString()); // eslint-disable-line no-console

            await this.terminate();

            throw e;
        }

        return this;
    }

    /**
     * Starts all the services of the bot
     *
     * @return {Promise<any[]>}
     */
    startDispatchers() {
        return Promise.all(
            this.dispatchers.map(dispatcher => dispatcher.start()),
        );
    }

    /**
     *
     * @param dispatchers
     */
    registerDispatchers(dispatchers) {
        for (const dispatcher of dispatchers) {
            this.registerDispatcher(dispatcher);
        }
    }

    /**
     *
     * @param dispatcher
     */
    registerDispatcher(dispatcher) {
        this.dispatchers.push(dispatcher);
    }

    /**
     * Stops all the services of the bot
     *
     * @return {Promise<any[]>}
     */
    stopDispatchers() {
        return Promise.all(
            this.dispatchers.map(dispatcher => dispatcher.stop()),
        );
    }

    /**
     *
     * @return {*[]}
     */
    get startedDispatchers() {
        return this.dispatchers.filter(({ started }) => started);
    }

    /**
     * Safely terminates the bot
     */
    async terminate() {
        this.app.resolve('logger')
            .log('info', {
                message: 'Terminating',
                label: 'kernel',
            });

        await this.stopDispatchers();

        await this.app.dispose();
    }

    /**
     * Bootstraps the app if not done
     */
    async bootstrap() {
        if (!this.app.hasBeenBootstrapped) {
            await this.app.bootstrapWith(this.bootstrappers);
        }
    }

    /**
     * Array of bootstrappers
     *
     * @return {*[]}
     */
    get bootstrappers() {
        return [
            LoadModules,
            RegisterProviders,
            BootProviders,
        ];
    }
};
