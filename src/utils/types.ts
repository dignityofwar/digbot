import {EventEmitter as BaseEmitter} from 'events';

declare interface EventEmitter<T extends Record<string | symbol, any[]> = Record<string | symbol, any[]>> {
    addListener<E extends keyof T>(event: E, listener: (...args: T[E]) => void): this;

    on<E extends keyof T>(event: E, listener: (...args: T[E]) => void): this;

    once<E extends keyof T>(event: E, listener: (...args: T[E]) => void): this;

    removeListener<E extends keyof T>(event: E, listener: (...args: T[E]) => void): this;

    off<E extends keyof T>(event: E, listener: (...args: T[E]) => void): this;

    removeAllListeners<E extends keyof T>(event?: E): this;

    setMaxListeners(n: number): this;

    getMaxListeners(): number;

    listeners<E extends keyof T>(event: E): Function[];

    rawListeners<E extends keyof T>(event: E): Function[];

    emit<E extends keyof T>(event: E, ...args: T[E]): boolean;

    listenerCount<E extends keyof T>(event: E): number;

    prependListener<E extends keyof T>(event: E, listener: (...args: T[E]) => void): this;

    prependOnceListener<E extends keyof T>(event: E, listener: (...args: T[E]) => void): this;

    eventNames<E extends keyof T>(): E[];
}

class EventEmitter extends BaseEmitter {
}

export {EventEmitter};