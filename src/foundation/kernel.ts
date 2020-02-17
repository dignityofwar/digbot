import { injectable, Container } from 'inversify';
import Bot from '../bot/bot';
import { Logger } from 'winston';
import { childLogger } from '../logger/logger';
import KernelContract from './contracts/kernelcontract';

/**
 * The Kernel is the root of the app and will be the entry point to run it
 */
@injectable()
export default class Kernel implements KernelContract {
    private static logger: Logger = childLogger('kernel');

    /**
     * The IoC container for DI
     */
    private container: Container;

    /**
     * A instance of Bot our app will run
     */
    private bot: Bot;

    /**
     * Constructor for the Kernel
     *
     * @param {Container} container the IoC container
     * @param {Bot} bot
     */
    public constructor(container: Container, bot: Bot) {
        this.container = container;
        this.bot = bot;
    }

    /**
     * Starts running the app
     *
     * @return {Promise<void>}
     */
    public async run(): Promise<void> {
        Kernel.logger.info('Starting');
        await this.bot.start();
    }

    /**
     * Terminates the app
     *
     * @param {number} code
     * @return {Promise<void>}
     */
    public async terminate(code?: number): Promise<void> {
        Kernel.logger.info('Terminating');
        await this.bot.stop();

        process.exit(code);
    }
}
