const config = require('config');
const { asValue } = require('awilix');
const ServiceProvider = require('../foundation/serviceprovider');

const mongoose = require('../database/mongoose');

module.exports = class DatabaseProvider extends ServiceProvider {
    /**
     * Register any app dependency
     */
    register() {
        this.container.register('mongoose', asValue(mongoose));
    }

    /**
     * @return {Promise<void>}
     */
    async boot({ logger }) {
        await mongoose.connect(config.get('database.mongo.url'));

        mongoose.connection.on('error', message => logger.error({
            message,
            label: 'mongoose',
        }));

        mongoose.connection.on('disconnected',
            () => mongoose.connect(config.get('database.mongo.url')));
    }
};
