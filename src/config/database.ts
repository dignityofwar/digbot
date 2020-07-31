import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';
import { SqliteConnectionOptions } from 'typeorm/driver/sqlite/SqliteConnectionOptions';
import { EntitySchema } from 'typeorm/entity-schema/EntitySchema';
import { get, getBool, getInt } from '../utils/env';

import Command from '../models/Command';
import Filter from '../models/Filter';
import List from '../models/List';
import Snowflake from '../models/Snowflake';
import Throttle from '../models/Throttle';
import AntiSpamConfig from '../models/AntiSpamConfig';

export default class Database {
    public readonly entities: (Function | string | EntitySchema)[] = [
        AntiSpamConfig,
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
            synchronize: getBool('DATABASE_SYNCHRONIZE', true),
        },
        'sqlite': {
            type: 'sqlite',
            database: get('DATABASE_PATH', 'storage/database.sqlite'),
            entities: this.entities,
            synchronize: getBool('DATABASE_SYNCHRONIZE', true),
        },
    };
}

export declare type DatabaseDriverOptions = MysqlConnectionOptions | SqliteConnectionOptions;
export declare type Drivers = {
    [K in string]: DatabaseDriverOptions;
}
