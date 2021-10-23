import {config} from './foundation/config';
import {Env} from './foundation/decorators/env-var.decorator';
import {IsInt, IsNotEmpty, IsPositive, IsString} from 'class-validator';
import {Type} from 'class-transformer';

class RedisConfig {
    @Env('REDIS_PORT')
    @Type(() => Number)
    @IsInt()
    @IsPositive()
    port = 6379;

    @Env('REDIS_HOST')
    @IsString()
    @IsNotEmpty()
    host = 'localhost';
}

export const redisConfig = config(RedisConfig);
