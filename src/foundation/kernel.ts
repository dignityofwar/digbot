import { injectable, Container, multiInject } from 'inversify';
import { Logger } from 'winston';
import { childLogger } from '../logger/logger';
import KernelContract from './contracts/kernelcontract';
import Runnable from './runnable';

enum KernelState {
    Idle,
    Starting,
    Running,
    Terminating
}

/**
 * The Kernel is the root of the app and will be the entry point to run it
 */
@injectable()
export default class Kernel implements KernelContract {
    private static logger: Logger = childLogger('kernel');

    private status: KernelState = KernelState.Idle;

    /**
     * The IoC container for DI
     */
    private container: Container;

    /**
     *
     */
    private readonly runnables: Runnable[];

    /**
     * Constructor for the Kernel
     *
     * @param {Container} container the IoC container
     * @param {Runnable} runnables
     */
    public constructor(container: Container, @multiInject(Runnable) runnables: Runnable[]) {
        this.container = container;
        this.runnables = runnables;
    }

    /**
     * Starts running the app
     *
     * @return {Promise<void>}
     */
    public async run(): Promise<void> {
        if (this.status != KernelState.Idle) return;
        this.status = KernelState.Starting;

        Kernel.logger.info('Starting');
        await Promise.all(this.runnables.map((runnable) => runnable.boot?.apply(runnable)));

        await Promise.all(this.runnables.map(runnable => runnable.start?.apply(runnable)));

        this.status = KernelState.Running;
    }

    /**
     * Terminates the app
     *
     * @param {number} code
     * @return {Promise<void>}
     */
    public async terminate(code?: number): Promise<void> {
        if (this.status != KernelState.Running) return;
        this.status = KernelState.Terminating;

        Kernel.logger.info('Terminating');
        await Promise.all(this.runnables.map(runnable => runnable.terminate?.apply(runnable)));

        process.exit(code);
    }
}
