export class Queue<T> {
    private readonly queue = new Set<T>();

    private readonly wait = new Set<(value: T) => void>();

    add(item: T): void {
        if (this.wait.size > 0) {
            const [waiting] = this.wait;
            this.wait.delete(waiting);

            waiting(item);
        } else {
            this.queue.add(item);
        }
    }

    remove(): T | undefined {
        const [item] = this.queue;

        if (item) this.queue.delete(item);

        return item;
    }

    peek(): T | undefined {
        const [item] = this.queue;

        return item;
    }

    take(): Promise<T> {
        return new Promise((resolve => {
            this.wait.add(resolve);
        }));
    }

    clear(): void {
        this.queue.clear();
    }

    get size(): number {
        return this.queue.size;
    }

    get isEmpty(): boolean {
        return this.queue.size == 0;
    }
}
