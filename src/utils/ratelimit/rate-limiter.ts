import {Inject, Injectable} from '@nestjs/common';
import IORedis, {Redis} from 'ioredis';

@Injectable()
export class RateLimiter {
    constructor(
        @Inject(IORedis)
        private readonly redis: Redis,
    ) {
    }

    attempt(key: string, maxAttempts: number, decay: number): Promise<void> {
        return new Promise(async resolve => {
            if (!await this.tooManyAttempts(key, maxAttempts)) {
                await this.hit(key, decay);

                resolve();
            }
        });
    }

    async tooManyAttempts(key: string, maxAttempts: number): Promise<boolean> {
        return await this.attempts(key) >= maxAttempts;
    }

    async hit(key: string, decay: number): Promise<number> {
        const hits = await this.redis.incr(key);

        if (hits == 1)
            await this.redis.expire(key, decay);

        return hits;
    }

    async attempts(key: string): Promise<number> {
        return Number.parseInt(await this.redis.get(key), 10);
    }

    async clear(key: string): Promise<void> {
        await this.redis.del(key);
    }

    async retriesLeft(key: string, maxAttempts): Promise<number> {
        const attempts = await this.attempts(key);

        return maxAttempts - attempts;
    }

    async availableIn(key: string): Promise<number> {
        const ttl = await this.redis.ttl(key);

        return Math.max(ttl, 0);
    }
}
