// const LoadModules = require('./bootstrappers/loadmodules');
const RegisterProviders = require('./bootstrappers/registerproviders');
const BootProviders = require('./bootstrappers/bootproviders');

module.exports = class Kernel {
    /**
     * @param app
     */
    constructor({ app }) {
        this.app = app;
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

        return this.createBot();
    }

    /**
     * Starts the bot
     *
     * @return {*}
     */
    createBot() {
        return this.app.resolve('discordjsClient');
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
