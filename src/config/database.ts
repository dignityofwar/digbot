import DatabaseContract, { DatabaseDriverOptions, DatabaseEntity } from './contracts/databasecontract';
import GamePresence from '../models/gamepresence';

export default class Database implements DatabaseContract {
    public readonly entities: DatabaseEntity[] = [
        GamePresence,
    ];

    public readonly driver: string = process.env.DATABASE_DRIVER || 'sqlite';

    public readonly drivers: DatabaseDriverOptions[] = [
        {
            type: 'mysql',
            host: process.env.DATABASE_HOST || 'localhost',
            port: process.env.DATABASE_PORT ? parseInt(process.env.DATABASE_PORT) : 3306,
            username: process.env.DATABASE_USERNAME || '',
            password: process.env.DATABASE_PASSWORD || '',
            database: process.env.DATABASE_DATABASE || 'digbot',
            ssl: /^true$/i.test(process.env.DATABASE_SSL?.trim() || ''),
            entities: this.entities,
        }, {
            type: 'sqlite',
            database: process.env.DATABASE_PATH || 'storage/database.sqlite',
            entities: this.entities,
        },
    ];


}

