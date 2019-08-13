module.exports = class RateLimiter {
    constructor({ redisClient }) {
        this.redis = redisClient;
    }

    /**
     * @param {String} key
     * @param {Number} maxAttempts
     * @return {boolean}
     */
    async tooManyAttempts(key, maxAttempts) {
        return (await this.attempts(key)) >= maxAttempts;
    }

    /**
     * @param {String} key
     * @param {Number} decay
     * @param {Number} times
     * @return {Promise<Number>}
     */
    async hit(key, decay, times = 1) {
        const hits = await this.attempts(key);

        const pipeline = this.redis.pipeline().incrby(`ratelimiter:${key}`, times);

        if (!hits) {
            pipeline.expire(`ratelimiter:${key}`, decay * 60);
        }

        return pipeline.exec().then(([[, h]]) => h);
    }

    /**
     * @param {String} key
     */
    async attempts(key) {
        return await this.redis.get(`ratelimiter:${key}`) || 0;
    }

    /**
     * @param {String} key
     * @return {Promise<boolean>}
     */
    async resetAttempts(key) {
        return this.redis.del(`ratelimiter:${key}`).then(r => !!r);
    }

    /**
     * @param {String} key
     * @param {Number} maxAttempts
     * @return {Promise<Number>}
     */
    async retriesLeft(key, maxAttempts) {
        return maxAttempts - await this.attempts(key);
    }

    // async availableIn(key) {
    //     return
    // }
};
