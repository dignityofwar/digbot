const { asFunction } = require('awilix');
const { createLogger, format, transports: { Console: ConsoleTransport } } = require('winston');
const config = require('config');
const ServiceProvider = require('../core/serviceprovider');

module.exports = class LoggerProvider extends ServiceProvider {
    /**
     * Register any app dependency
     */
    register() {
        // TODO: Allow config to alter how logging is done
        this.container.register('loggerConsoleTransport',
            asFunction(() => new ConsoleTransport(config.get('logger.transports.console'))));

        this.container.register('logger', asFunction(({ loggerConsoleTransport }) => createLogger({
            level: config.util.getEnv('NODE_ENV') === 'development' ? 'silly' : 'info',
            format: format.combine(
                format.colorize(),
                format.timestamp({
                    format: 'YYYY-MM-DD HH:mm:ss',
                }),
                format.printf(info => `${info.timestamp} [${info.label || 'general'}] ${info.level}: ${info.message}`),
            ),
            transports: [
                loggerConsoleTransport,
            ],
        }))
            .singleton());
    }
};
