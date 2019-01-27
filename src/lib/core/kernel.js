const EventEmitter = require('events');

const LoadModules = require('./bootstrappers/loadmodules');
const RegisterProviders = require('./bootstrappers/registerproviders');
const BootProviders = require('./bootstrappers/bootproviders');

const registeredDispatchers = require('../dispatchers/register');

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

            await this.runDispatchers();

        } catch (e) {
            // TODO: Errors are not printed to the console, probably because the logger is not initialised

            await this.terminate();

            throw e;
        }

        return this;
    }

    /**
     *
     * @return {Promise<void>}
     */
    async runDispatchers() {
        this.registerDispatchers(registeredDispatchers);

        await this.startDispatchers();
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
     * @param Dispatcher
     */
    registerDispatcher(Dispatcher) {
        this.dispatchers.push(new Dispatcher(this.app.cradle));
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
            LoadModules, // TODO: Should be enabled, but indexing and namespacing should be determined
            RegisterProviders,
            BootProviders,
        ];
    }
};
