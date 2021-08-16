import {envMap} from './foundation/utils';
import {LogLevel} from '@nestjs/common';

export const loggerConfig = {
    levels: envMap<LogLevel[]>('LOG_LEVELS', (val) => val?.split(',') as LogLevel[] ?? ['error', 'warn', 'log']),
};
