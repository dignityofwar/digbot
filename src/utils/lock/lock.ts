import {EventEmitter} from "events";

declare interface Lock {
    on(event: 'unlock', listener: () => void): this;

    on(event: 'lock', listener: () => void): this;
}

class Lock extends EventEmitter {
    private purgatory?: Promise<this>;
    private readonly queue = new Set<(i: this) => void>();

    async lock(): Promise<this> {
        const wait = this.purgatory;
        if (!wait) this.emit('lock');

        this.purgatory = new Promise((resolve) => {
            this.queue.add(resolve);
        });

        return wait;
    }

    unlock(): void {
        const [unlock] = this.queue;
        this.queue.delete(unlock);

        unlock(this);
        if (this.queue.size == 0) this.emit('unlock');
    }
}

export {Lock};
