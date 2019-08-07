const { isEmpty, capitalize } = require('lodash');
const { asFunction, asValue } = require('awilix');
const { createLogger, format, transports: { Console: ConsoleTransport } } = require('winston');
const config = require('config');
const ServiceProvider = require('../foundation/serviceprovider');
const DiscordTransport = require('../logger/discordtransport');

module.exports = class LoggerProvider extends ServiceProvider {
    /**
     * Register any app dependency
     */
    register() {
        this.container.register('loggerDefaultFormat', asValue([
            format.timestamp({
                format: 'YYYY-MM-DD HH:mm:ss',
            }),
            format.printf(info => `${info.timestamp} [${info.label || 'general'}] ${info.level}: ${info.message}`),
        ]));

        this.container.register('loggerConsoleTransportFactory',
            asFunction(({ loggerDefaultFormat }) => (level) => {
                const opts = {
                    format: format.combine(
                        format.colorize(),
                        ...loggerDefaultFormat,
                    ),
                };

                if (!isEmpty(level)) {
                    opts.level = level;
                }

                return new ConsoleTransport(opts);
            }));

        this.container.register('loggerDiscordTransportFactory',
            asFunction(({ discordjsClient, queuesDiscordmessagequeue }) => (channelID, level) => {
                const opts = {
                    format: format.combine(
                        ...this.container.resolve('loggerDefaultFormat'),
                    ),
                    channelID,
                };

                if (!isEmpty(level)) {
                    opts.level = level;
                }

                return new DiscordTransport({
                    discordjsClient,
                    queuesDiscordmessagequeue,
                    opts,
                });
            }));

        this.container.register('logger', asFunction(({ loggerConsoleTransportFactory }) => createLogger({
            level: config.get('logger.level'),
            transports: [
                loggerConsoleTransportFactory(),
            ],
        }))
            .singleton());
    }

    async boot({ logger }) {
        for (const transportConfig of config.get('logger.transports')) {
            logger.add(this.createTransport(transportConfig));
        }

        process.prependListener('uncaughtException', this.errorHandler.bind(this));
        process.prependListener('unhandledRejection', this.errorHandler.bind(this));
    }

    errorHandler(error) {
        this.container.resolve('logger')
            .log('error', error instanceof Error ? error.stack : error.toString());
    }

    createTransport(transportConfig) {
        switch (transportConfig.transport) {
        case 'discord':
            return this.container.resolve('loggerDiscordTransportFactory')(transportConfig.channelID,
                transportConfig.level);
        default:
            throw new Error(`Unkown log transport: ${transportConfig.transport}`);
        }
    }
};
