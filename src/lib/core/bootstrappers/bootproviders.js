module.exports = class BootProviders {
    /**
     *
     * @param app
     */
    async bootstrap({ app }) {
        await app.boot();
    }
};
