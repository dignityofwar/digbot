import { inject, injectable, optional } from 'inversify';
import { RedisClient } from 'redis';
import RateLimiter from './RateLimiter';

export type RedisRateLimiterOptions = {
    keyPrefix?: string;
};

@injectable()
export default class RedisRateLimiter extends RateLimiter {
    private readonly keyPrefix: string;

    /**
     * @param {RedisClient} redis
     * @param {RedisRateLimiterOptions} options
     */
    public constructor(
        private readonly redis: RedisClient,
        @inject('options') @optional() options?: RedisRateLimiterOptions,
    ) {
        super();

        this.keyPrefix = options?.keyPrefix ?? 'ratelimiter';
    }


    /**
     * @param {String} key
     * @param {Number} maxAttempts
     * @return {boolean}
     */
    public async tooManyAttempts(key: string, maxAttempts: number): Promise<boolean> {
        return (await this.attempts(key)) >= maxAttempts;
    }

    /**
     * @param {String} key
     * @param {Number} decay
     * @param {Number} times
     * @return {Promise<Number>}
     */
    public hit(key: string, decay: number, times = 1): Promise<number> {
        return new Promise<number>(async (resolve, reject) => {
            key = this.key(key);
            const hits = await this.attempts(key);

            const pipeline = this.redis.multi();

            pipeline.incrby(key, times);

            if (!hits)
                pipeline.expire(key, decay);

            pipeline.exec((e, [, h]) => e ? reject(e) : resolve(h));
        });
    }

    /**
     * @param {String} key
     */
    public async attempts(key: string): Promise<number> {
        return new Promise(async (resolve, reject) => {
            key = this.key(key);
            this.redis.get(key, (e, n) => e ? reject(e) : resolve(parseInt(n)));
        });
    }

    /**
     * @param {String} key
     * @return {Promise<boolean>}
     */
    public async resetAttempts(key: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            key = this.key(key);
            this.redis.del(key, (e, n) => e ? reject(e) : resolve(n > 0));
        });
    }

    /**
     * @param {String} key
     * @param {Number} maxAttempts
     * @return {Promise<Number>}
     */
    public async retriesLeft(key: string, maxAttempts: number): Promise<number> {
        return maxAttempts - await this.attempts(key);
    }

    /**
     * @param {string} key
     * @return {string}
     */
    private key(key: string): string {
        return `${this.keyPrefix}:${key}`;
    }
}
