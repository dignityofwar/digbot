import Request from './request';
import { injectable } from 'inversify';

@injectable()
export default abstract class Command {
    /**
     * The name of the command(without spaces)
     */
    public abstract readonly name: string;

    /**
     * Run the command given the request
     *
     * @param request the request that triggered the command
     */
    public abstract async execute(request: Request): Promise<void>;
}
