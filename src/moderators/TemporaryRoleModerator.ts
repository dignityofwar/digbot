import Runnable from '../foundation/concerns/Runnable';

export default class TemporaryRoleModerator implements Runnable {
    public bootPriority = 10;
    public terminatePriority = 10;

    public async boot(): Promise<void> {

    }

    public async start(): Promise<void> {

    }

    public async terminate(): Promise<void> {

    }
}
