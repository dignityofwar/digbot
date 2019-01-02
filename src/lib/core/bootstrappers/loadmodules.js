module.exports = class LoadModules {
    /**
     * Load all modules into the container
     *
     * @param app
     */
    bootstrap({ app }) {
        app.loadModules(this.locations);
    }

    /**
     * Returns all locations loadModules should search in
     *
     * @return {Array}
     */
    get locations() {
        return [];
    }
};
