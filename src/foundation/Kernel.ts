import { injectable, Container, multiInject } from 'inversify';
import { getLogger } from '../logger';
import KernelContract from './contracts/KernelContract';
import Runnable, { RUNNABLE } from './Runnable';
import config from '../config';

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
    private static readonly logger = getLogger('kernel');

    public static readonly version: string = '2.0.0-alfa';

    private status: KernelState = KernelState.Idle;

    /**
     * Constructor for the Kernel
     *
     * @param {Container} container the IoC container
     * @param {Runnable} runnables
     */
    public constructor(
        private readonly container: Container,
        @multiInject(RUNNABLE) private readonly runnables: Runnable[],
    ) {
    }

    /**
     * Starts running the app
     *
     * @return {Promise<void>}
     */
    public async run(): Promise<void> {
        if (this.status != KernelState.Idle) return;
        this.status = KernelState.Starting;

        Kernel.logger.info(`Starting {version: ${Kernel.version}, environment: ${config.app.environment}}`);

        try {
            Kernel.logger.info('Booting services');
            await Promise.all(this.runnables.map((runnable) => runnable.boot?.apply(runnable)));

            Kernel.logger.info('Starting services');
            await Promise.all(this.runnables.map(runnable => runnable.start?.apply(runnable)));

            this.status = KernelState.Running;
        } catch (e) {
            Kernel.logger.error(`Error on startup: ${e}`);
            await this.terminate(1);
        }
    }

    /**
     * Terminates the app
     *
     * @param {number} code
     * @return {Promise<void>}
     */
    public async terminate(code = 0): Promise<void> {
        if (this.status == KernelState.Idle || this.status == KernelState.Terminating) return;
        this.status = KernelState.Terminating;

        Kernel.logger.info(`Terminating (code: ${code})`);

        try {
            await Promise.all(this.runnables.map(runnable => runnable.terminate?.apply(runnable)));
        } catch (e) {
            Kernel.logger.error(`Error on termination: ${e}`);
        } finally {
            Kernel.logger.info('Goodbye :)');
            process.exit(code);
        }
    }

    /**
     * @param err
     * @param {number} code
     * @return {Promise<void>}
     */
    public async terminateError(err: any, code = 1): Promise<void> {
        Kernel.logger.error(err.stack ?? err.message ?? err.toString());

        await this.terminate(code);
    }
}
