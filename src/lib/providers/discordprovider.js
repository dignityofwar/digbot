const config = require('config');
const { asFunction } = require('awilix');
const { Client } = require('discord.js');
const ServiceProvider = require('../foundation/serviceprovider');

const subBots = require('../sub-bots/sub-bots');

module.exports = class DiscordProvider extends ServiceProvider {
    /**
     * Register any app dependency
     */
    register() {
        this.container.register('discordjsClient', asFunction(({ logger }) => {
            const client = new Client();

            const log = message => ({
                message,
                label: 'discordjsClient',
            });

            client.on('ready', () => logger.info(log('Connected to Discord')));

            client.on('reconnecting', () => logger.info(log('Reconnected to Discord')));

            client.on('disconnect',
                event => logger.warn(log(`Disconnected from Discord(code ${event.code}): ${event.reason}`)));

            client.on('debug', message => logger.debug(log(message)));

            client.on('warn', message => logger.warn(log(message)));

            client.on('error', ({ message }) => logger.error(log(message)));

            return client;
        })
            .singleton()
            .disposer(client => client.destroy()));
    }

    /**
     * Boots any dependency
     *
     * @return {Promise<void>}
     */
    async boot({ discordjsClient }) {
        await discordjsClient.login(config.get('token'));

        setImmediate(subBots.ready);
    }
};
