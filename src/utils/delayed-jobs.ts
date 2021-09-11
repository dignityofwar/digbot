import Timeout = NodeJS.Timeout;
import {clearTimeout} from 'timers';

export class DelayedJobs {
    private readonly queued = new Map<string, Timeout>();

    has(key: string): boolean {
        return this.queued.has(key);
    }

    queue(key: string, delay: number, job: () => void) {
        if (this.has(key))
            throw new Error(`Job with key "${key}" is already set`);

        this.queued.set(
            key,
            setTimeout(() => {
                this.queued.delete(key);

                job();
            }, delay).unref(),
        );
    }

    cancel(key: string): boolean {
        if (this.has(key)) {
            clearTimeout(this.queued.get(key));
            this.queued.delete(key);

            return true;
        }

        return false;
    }
}