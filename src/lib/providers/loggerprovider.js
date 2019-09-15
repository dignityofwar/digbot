const { isEmpty } = require('lodash');
const { asFunction, asValue } = require('awilix');
const { createLogger, format, transports: { Console: ConsoleTransport } } = require('winston');
const config = require('config');

const ServiceProvider = require('../foundation/serviceprovider');

const DiscordTransport = require('../logger/transports/discordtransport');
const discordRichEmbed = require('../logger/utils/discordrichembedformat');

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
                        discordRichEmbed(),
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

    async boot({ kernel, logger }) {
        for (const transportConfig of config.get('logger.transports')) {
            logger.add(this.createTransport(transportConfig));
        }

        process.prependListener('uncaughtException', this.errorHandler.bind(this, kernel));
        process.prependListener('unhandledRejection', this.errorHandler.bind(this, kernel));
    }

    errorHandler(kernel, error) {
        this.container.resolve('logger')
            .log('error', error instanceof Error ? error.stack : error.toString());

        kernel.terminate(1);
    }

    createTransport(transportConfig) {
        switch (transportConfig.transport) {
        case 'discord':
            return this.container.resolve('loggerDiscordTransportFactory')(transportConfig.channelID,
                transportConfig.level);
        default:
            throw new Error(`Unknown log transport: ${transportConfig.transport}`);
        }
    }
};
