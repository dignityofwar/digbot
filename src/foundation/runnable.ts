import { injectable } from 'inversify';

@injectable()
export default abstract class Runnable {
    public boot?(): Promise<void>;

    public start?(): Promise<void>;

    public terminate?(): Promise<void>;
}
