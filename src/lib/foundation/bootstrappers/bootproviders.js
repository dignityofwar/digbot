module.exports = class BootProviders {
    /**
     * Boots all the services given by the service providers
     *
     * @param app
     */
    async bootstrap({ app }) {
        await app.boot();
    }
};
