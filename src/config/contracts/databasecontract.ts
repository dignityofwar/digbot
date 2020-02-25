import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';
import { SqliteConnectionOptions } from 'typeorm/driver/sqlite/SqliteConnectionOptions';
import { EntitySchema } from 'typeorm/entity-schema/EntitySchema';

export default interface DatabaseContract {
    readonly entities: DatabaseEntity[];
    readonly driver: string;
    readonly drivers: DatabaseDriverOptions[];
}

export declare type DatabaseDriverOptions = MysqlConnectionOptions | SqliteConnectionOptions;
export declare type DatabaseEntity = (Function | string | EntitySchema);

export const DATABASECONTRACT = Symbol.for('config.contracts.DatabaseContract');
