import {LogLevel} from '@nestjs/common';
import {Env} from './foundation/decorators/env.decorator';
import {Transform} from 'class-transformer';
import {ArrayUnique, IsArray, IsIn} from 'class-validator';
import {config} from './foundation/config';

class LoggerConfig {
    @Env('LOG_LEVELS')
    @Transform(({value}) => typeof value == 'string' ? value.split(',') : value)
    @IsArray()
    @IsIn(['error', 'warn', 'log', 'debug', 'verbose'], {each: true})
    @ArrayUnique()
    levels: LogLevel[] = ['error', 'warn', 'log'];
}

export const loggerConfig = config(LoggerConfig);
