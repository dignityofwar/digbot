const config = require('config');
const { asFunction } = require('awilix');
const ServiceProvider = require('../foundation/serviceprovider');

const mongoose = require('../database/mongoose');

module.exports = class DatabaseProvider extends ServiceProvider {
    /**
     * Register any app dependency
     */
    register() {
        this.container.register('mongoose', asFunction(() => mongoose).disposer(() => mongoose.disconnect()));
    }

    /**
     * Connects to the database and set a listener for errors.
     *
     * @return {Promise<void>}
     */
    async boot({ logger }) {
        await mongoose.connect(config.get('database.mongo.url'));

        mongoose.connection.on('error', message => logger.error({
            message,
            label: 'mongoose',
        }));

        mongoose.connection.on('reconnectFailed', () => {
            logger.error({
                message: 'Connection to database lost',
                label: 'mongoose',
            });

            process.exit(-1);
        });
    }
};
