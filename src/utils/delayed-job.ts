import Timeout = NodeJS.Timeout;

export abstract class DelayedJob<T> {
    private timeout?: Timeout;
    private _triggered = false;
    private promise = new Promise<T>((resolve, reject) => {
        this.done = resolve;
        this.stopped = reject;
    });
    private done: (result: T) => void;
    private stopped: (err: Error) => void;

    protected constructor(
        private readonly delay: number,
        autorun = false,
    ) {
        if (autorun)
            this.run();
    }

    run(): boolean {
        if (this.timeout) return false;

        this.timeout = setTimeout(async () => {
            this._triggered = true;
            this.done(await this.execute());
        }, this.delay).unref();

        return true;
    }

    cancel(): boolean {
        if (!this.timeout || this._triggered) return false;

        clearTimeout(this.timeout);
        this.stopped(new Error('DelayedJob cancelled'));
        return true;
    }

    await(): Promise<T> {
        return this.promise;
    }

    get triggered(): boolean {
        return this._triggered;
    }

    protected abstract execute(): T | Promise<T>;
}