// const LoadModules = require('./bootstrappers/loadmodules');
const RegisterProviders = require('./bootstrappers/registerproviders');
const BootProviders = require('./bootstrappers/bootproviders');

module.exports = class Kernel {
    /**
     * @param app
     */
    constructor({ app }) {
        this.app = app;

        this.runningServices = [];
        this.stoppedServices = [];
    }

    /**
     * Bootstraps and starts the bot
     */
    async run() {
        try {
            await this.bootstrap();
        } catch (e) {
            await this.terminate();

            throw e;
        }

        return await this.createBot();
    }

    /**
     * Starts the bot
     *
     * @return {*}
     */
    async createBot() {
        return this.app.resolve('discordjsClient');
    }

    /**
     * Starts all the services of the bot
     *
     * @return {Promise<void>}
     */
    async startBotServices() {
        // TODO: Starts all services that depends on the client(commands, management, loggers, etc)
    }

    /**
     * Returns an array of services that the bot
     *
     * TODO: Maybe let the array of services be inserted in the run command, or as separate function of the kernel
     *
     * @return {Array}
     */
    get botServices() {
        return [];
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
            // LoadModules, // TODO: Should be enabled, but indexing and namespacing should be determined
            RegisterProviders,
            BootProviders,
        ];
    }
};
