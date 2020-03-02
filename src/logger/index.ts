import { createLogger, transports, format, Logger } from 'winston';
import { loggingConfig } from '../config/logging';

/**
 * A default instance of the index
 */
const logger = createLogger({
    level: loggingConfig.level,
    format: format.combine(
        format.colorize(),
        format.timestamp(),
        format.printf(({timestamp, label, level, message}) => `${timestamp} | ${label} | ${level} | ${message}`),
    ),
    transports: [
        new transports.Console(),
    ],
});

/**
 * Creates a index for a module
 *
 * @param {string} label The name of the module
 */
export function getLogger(label: string): Logger {
    return logger.child({label});
}

export default logger;

