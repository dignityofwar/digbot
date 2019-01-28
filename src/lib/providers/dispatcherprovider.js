const ServiceProvider = require('../core/serviceprovider');

module.exports = class DispatcherProvider extends ServiceProvider {
    get dispatchers() {
        return [
            // 'dispatchersMessagedispatcher',
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
