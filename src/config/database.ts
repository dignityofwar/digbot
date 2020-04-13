import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';
import { SqliteConnectionOptions } from 'typeorm/driver/sqlite/SqliteConnectionOptions';
import { EntitySchema } from 'typeorm/entity-schema/EntitySchema';
import { get, getBool, getInt } from '../utils/env';

import Command from '../models/command';
import Filter from '../models/filter';
import List from '../models/list';
import Snowflake from '../models/snowflake';
import Throttle from '../models/throttle';

export default class Database {
    public readonly entities: DatabaseEntity[] = [
        Command,
        Filter,
        List,
        Snowflake,
        Throttle,
    ];

    public readonly driver: string = get('DATABASE_DRIVER', 'sqlite');

    public readonly drivers: Drivers = {
        'mysql': {
            type: 'mysql',
            host: get('DATABASE_HOST', 'localhost'),
            port: getInt('DATABASE_PORT', 3306),
            username: get('DATABASE_USERNAME'),
            password: get('DATABASE_PASSWORD', ''),
            database: get('DATABASE_DATABASE', 'digbot'),
            ssl: getBool('DATABASE_SSL'),
            entities: this.entities,
        },
        'sqlite': {
            type: 'sqlite',
            database: get('DATABASE_PATH', 'storage/database.sqlite'),
            entities: this.entities,
        },
    };
}

export declare type DatabaseDriverOptions = MysqlConnectionOptions | SqliteConnectionOptions;
export declare type DatabaseEntity = (Function | string | EntitySchema);
export declare type Drivers = {
    [K in string]: DatabaseDriverOptions;
}
