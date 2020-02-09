import Request from './request';
import { injectable } from 'inversify';

@injectable()
export default abstract class Command {
    public abstract readonly name: string;

    public abstract async execute(request: Request): Promise<void>;
}
