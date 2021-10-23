import {Module} from '@nestjs/common';
import {RedisModule} from '../../redis/redis.module';
import {RateLimiter} from './rate-limiter';

@Module({
    imports: [
        RedisModule,
    ],
    providers: [
        RateLimiter,
    ],
    exports: [
        RateLimiter,
    ],
})
export class RateLimitModule {
}
