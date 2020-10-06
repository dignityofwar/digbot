export default interface Runnable {
    bootPriority?: number;

    terminatePriority?: number;

    boot?(): Promise<void>;

    start?(): Promise<void>;

    terminate?(): Promise<void>;
}

export const RUNNABLE = Symbol.for('foundation.concern.Runnable');
