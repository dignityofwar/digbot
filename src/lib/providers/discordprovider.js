const config = require('config');
const { asClass, asFunction } = require('awilix');
const { Client } = require('discord.js');
const { format } = require('winston');
const { version } = require('../../../package');
const ServiceProvider = require('../core/serviceprovider');
const DiscordTransport = require('../logger/discordtransport');

const admin = require('../admin/admin');
const commands = require('../commands/commands');
const subBots = require('../sub-bots/sub-bots');

const crashHandler = require('../crash-handling');
const server = require('../server/server');

module.exports = class DiscordProvider extends ServiceProvider {
    /**
     * Register any app dependency
     */
    register() {
        this.container.register('discordjsClient', asFunction(({ logger }) => {
            const client = new Client();

            client.on('debug', (info) => {
                logger.log('debug', {
                    message: info,
                    label: 'discordjsClient',
                });
            });

            // TODO: All listeners here should only log.

            // Emitted when the client client is ready
            client.on('ready', () => {
                crashHandler.logEvent('discordbot', 'ready');
            });

            client.on('reconnecting', () => {
                // Log level is warn so it will be logged to discord
                logger.log('warn', {
                    message: 'Client disconnected, attempting reconnection...',
                    label: 'discordjsClient',
                });
            });

            client.on('disconnect', (event) => {
                // Log level is warn so it will be logged to discord
                // TODO: Log level should depend on event.code
                logger.log('warn', {
                    message: `Disconnected(code ${event.code}): ${event.reason}`,
                    label: 'discordjsClient',
                });

                // Reconnects when connection is lost
                client.login(config.get('token'));
            });

            client.on('warn', (warning) => {
                logger.log('warn', {
                    message: warning,
                    label: 'discordjsClient',
                });
            });

            return client;
        })
            .singleton() // TODO: remove singleton to allow new instances to be created on disconnect
            .disposer(client => client.destroy()));

        // TODO: Should ignore all verbose or lower discordjsClient logs. Logging should be separated from the client.
        this.container.register('loggerDiscordTransport', asClass(DiscordTransport)
            .inject(() => ({
                opts: {
                    level: 'warn',
                    format: format.combine(
                        ...this.container.resolve('loggerDefaultFormat'),
                    ),
                },
            })));
    }

    /**
     * Boots any dependency
     *
     * @return {Promise<void>}
     */
    async boot() {
        // TODO: Shouldn't probably be started here
        await this.container.resolve('discordjsClient')
            .login(config.get('token'));

        this.container.resolve('logger')
            .add(this.container.resolve('loggerDiscordTransport'));

        if (server.getChannel('developers') !== null) {
            server.getChannel('developers')
                .sendMessage(
                    `DIGBot, reporting for duty! Environment: ${config.util.getEnv('NODE_ENV')}, Version: ${version}`,
                )
                .then(() => this.container.resolve('logger')
                    .log('info', 'Succesfully sent message'))
                .catch(err => this.container.resolve('logger')
                    .log('error', `Failed to send message error: ${err}`));
        }

        // Store the data for usage from other modules

        commands.ready();
        admin.ready();
        setTimeout(admin.startchecks, 2000);

        subBots.ready();
    }
};
