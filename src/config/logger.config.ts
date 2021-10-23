import {LogLevel} from '@nestjs/common';
import {Env} from './foundation/decorators/env-var.decorator';
import {Transform} from 'class-transformer';
import {ArrayUnique, IsArray, IsIn} from 'class-validator';
import {config} from './foundation/config';

class LoggerConfig {
    @Env('LOG_LEVELS')
    @Transform(({value}) => value.split(','))
    @IsArray()
    @IsIn(['error', 'warn', 'log', 'debug', 'verbose'], {each: true})
    @ArrayUnique()
    levels: LogLevel[] = ['error', 'warn', 'log'];
}

export const loggerConfig = config(LoggerConfig);
