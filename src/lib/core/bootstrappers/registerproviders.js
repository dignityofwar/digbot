const { asClass } = require('awilix');

module.exports = class RegisterProviders {
    /**
     *
     * @param app
     */
    bootstrap({ app }) {
        app.registerConfiguredProviders();
    }
};
