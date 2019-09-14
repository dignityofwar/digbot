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
    async boot() {
        await mongoose.connect(config.get('database.mongo.url', { useNewUrlParser: true }))
            .catch(e => console.log('Fail', e));

        console.log('Online');
    }
};
