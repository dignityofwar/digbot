const config = require('config');
const { asFunction } = require('awilix');
const { Client } = require('discord.js');
const { version } = require('../../../package');
const ServiceProvider = require('../foundation/serviceprovider');

const subBots = require('../sub-bots/sub-bots');
const server = require('../server/server');

module.exports = class DiscordProvider extends ServiceProvider {
    /**
     * Register any app dependency
     */
    register() {
        this.container.register('discordjsClient', asFunction(({ logger }) => {
            const client = new Client();

            client.on('ready', () => {
                logger.log('info', {
                    message: 'Connected to Discord',
                    label: 'discordjsClient',
                });
            });

            client.on('reconnecting', () => {
                // Log level is warn so it will be logged to discord
                logger.log('warn', {
                    message: 'Reconnected to Discord',
                    label: 'discordjsClient',
                });
            });

            client.on('disconnect', (event) => {
                // Log level is warn so it will be logged to discord
                // TODO: Log level should depend on event.code
                logger.log('warn', {
                    message: `Disconnected from Discord(code ${event.code}): ${event.reason}`,
                    label: 'discordjsClient',
                });
            });

            client.on('debug', (info) => {
                logger.log('debug', {
                    message: info,
                    label: 'discordjsClient',
                });
            });

            client.on('warn', (warning) => {
                logger.log('warn', {
                    message: warning,
                    label: 'discordjsClient',
                });
            });

            client.on('error', (error) => {
                logger.log('error', {
                    message: error.message,
                    label: 'discordjsClient',
                });
            });

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
    async boot({ discordjsClient, logger }) {
        await discordjsClient.login(config.get('token'));

        if (server.getChannel('developers')) {
            server.getChannel('developers')
                .sendMessage(
                    `DIGBot, reporting for duty! Environment: ${config.util.getEnv('NODE_ENV')}, Version: ${version}`,
                )
                .then(() => logger.log('info', 'Succesfully sent message'))
                .catch(err => logger.log('error', `Failed to send message error: ${err}`));
        }

        // TODO: Can be moved to ModeratorDispatcher or CommandDispatcher, we should probably introduce some throttle
        //   to replace this which retains memory when the bot crashes
        subBots.ready();
    }
};
