const ServiceProvider = require('../foundation/serviceprovider');

module.exports = class DispatcherProvider extends ServiceProvider {
    get dispatchers() {
        return [
            'dispatchersDiscordconnectiondispatcher',
            'dispatchersCommanddispatcher',
            'dispatchersModeratordispatcher',
        ];
    }

    /**
     *
     * @param kernel
     * @return {Promise<void>}
     */
    async boot({ kernel }) {
        kernel.registerDispatchers(this.dispatchers.map(this.container.resolve));
    }
};
