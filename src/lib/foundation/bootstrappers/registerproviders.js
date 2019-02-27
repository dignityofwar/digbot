module.exports = class RegisterProviders {
    /**
     * Registers all the services given by the service providers
     *
     * @param app
     */
    bootstrap({ app }) {
        app.registerConfiguredProviders();
    }
};
