export default abstract class RateLimiter {
    public abstract async tooManyAttempts(key: string, maxAttempts: number): Promise<boolean>;

    public abstract async hit(key: string, decay: number, times?: number): Promise<number>;

    public abstract async attempts(key: string): Promise<number>;

    public abstract async resetAttempts(key: string): Promise<boolean>;

    public abstract async retriesLeft(key: string, maxAttempts: number): Promise<number>;
}

export const RATELIMITER = Symbol.for('utils.RateLimiter');
