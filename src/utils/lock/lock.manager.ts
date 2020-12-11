import {Lock} from "./lock";

export class LockManager<K> {
    private readonly locks = new Map<K, Lock>();

    async lock(key: K): Promise<Lock> {
        const lock = this.locks.get(key) ?? this.createLock(key);

        return lock.lock();
    }

    private createLock(key: K): Lock {
        const lock = new Lock();
        this.locks.set(key, lock);

        lock.on('unlock', () => {
            this.locks.delete(key);
        });

        return lock;
    }
}
