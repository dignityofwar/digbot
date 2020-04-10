import { Connection, ConnectionManager } from 'typeorm';
import Runnable from '../foundation/runnable';
import { inject, injectable } from 'inversify';
import { DatabaseDriverOptions } from '../config/database';

@injectable()
export default class Connector implements Runnable {
    private manager: ConnectionManager = new ConnectionManager();
    private connection: Connection;

    public constructor(@inject('driverConfig') driver: DatabaseDriverOptions) {
        this.connection = this.manager.create(driver);
    }

    public async boot(): Promise<void> {
        await this.connection.connect();
    }

    public async terminate(): Promise<void> {
        await this.connection.close();
    }
}
