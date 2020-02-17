import Request from './request';
import { injectable } from 'inversify';

/**
 * Base class for a Command
 */
@injectable()
export default abstract class Command {
    /**
     * The name of the command(without spaces)
     */
    public abstract readonly name: string;

    /**
     * Run the command given the request
     *
     * @param {Request} request the request that triggered the command
     * @return {Promise<void>} promise which returns nothing when the command executed
     */
    public abstract async execute(request: Request): Promise<void>;
}
