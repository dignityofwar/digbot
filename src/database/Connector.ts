import Runnable from '../foundation/Runnable';
import { injectable } from 'inversify';
import { Connection } from 'typeorm';

@injectable()
export default class Connector implements Runnable {
    public constructor(private readonly connection: Connection) {
    }

    public async boot(): Promise<void> {
        await this.connection.connect();
    }

    public async terminate(): Promise<void> {
        await this.connection.close();
    }
}
