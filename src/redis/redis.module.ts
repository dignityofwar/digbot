import {Module} from '@nestjs/common';
import IORedis from 'ioredis';
import {redisConfig} from '../config/redis.config';

@Module({
    providers: [
        {
            provide: IORedis,
            useFactory: () => new IORedis(redisConfig.port, redisConfig.host),
        },
    ],
})
export class RedisModule {
}
