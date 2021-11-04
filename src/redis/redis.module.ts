import {Inject, Module} from '@nestjs/common';
import IORedis, {Redis} from 'ioredis';
import {redisConfig} from '../config/redis.config';

@Module({
    providers: [
        {
            provide: IORedis,
            useFactory: () => new IORedis(redisConfig.port, redisConfig.host),
        },
    ],
    exports: [
        IORedis,
    ],
})
export class RedisModule {
    constructor(
        @Inject(IORedis)
        private readonly redis: Redis,
    ) {
        redis.on('error', err => {
            throw err;
        });
    }
}
