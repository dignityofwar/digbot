import { Redis } from 'ioredis';
import RateLimiter from './ratelimiter';

export type RedisRateLimiterOptions = {
    keyPrefix?: string;
};

export default class RedisRateLimiter extends RateLimiter {
    private readonly keyPrefix: string;

    /**
     * @param {Redis} redis
     * @param {RedisRateLimiterOptions} options
     */
    public constructor(private readonly redis: Redis, options?: RedisRateLimiterOptions) {
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
    public async hit(key: string, decay: number, times = 1): Promise<number> {
        const hits = await this.attempts(key);

        const pipeline = this.redis.pipeline().incrby(`${this.keyPrefix}:${key}`, times);

        if (!hits) {
            pipeline.expire(`${this.keyPrefix}:${key}`, decay);
        }

        return pipeline.exec().then(([[, h]]) => h);
    }

    /**
     * @param {String} key
     */
    public async attempts(key: string): Promise<number> {
        return parseInt(await this.redis.get(`${this.keyPrefix}:${key}`) ?? '');
    }

    /**
     * @param {String} key
     * @return {Promise<boolean>}
     */
    public async resetAttempts(key: string): Promise<boolean> {
        return this.redis.del(`${this.keyPrefix}:${key}`).then((r: any) => !!r);
    }

    /**
     * @param {String} key
     * @param {Number} maxAttempts
     * @return {Promise<Number>}
     */
    public async retriesLeft(key: string, maxAttempts: number): Promise<number> {
        return maxAttempts - await this.attempts(key);
    }
}
