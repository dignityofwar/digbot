import { createLogger, transports, format, Logger } from 'winston';

const logger = createLogger({
    level: 'info',
    format: format.combine(
        format.colorize(),
        format.timestamp(),
        format.printf(({timestamp, label, level, message}) => `${timestamp} | ${label} | ${level} | ${message}`),
    ),
    transports: [
        new transports.Console(),
    ],
});

export default logger;

export function childLogger(label: string): Logger {
    return logger.child({label});
}
