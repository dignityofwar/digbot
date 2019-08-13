const ServiceProvider = require('../foundation/serviceprovider');

module.exports = class DispatcherProvider extends ServiceProvider {
    // TODO: Dynamically add dispatchers
    get dispatchers() {
        return [
            'dispatchersDiscordconnectiondispatcher',
            'dispatchersCommanddispatcher',
            'dispatchersModeratordispatcher',
            'dispatchersPresencedispatcher',
            'dispatchersRoledispatcher',
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
