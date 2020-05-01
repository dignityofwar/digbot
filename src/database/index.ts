import { ContainerModule, interfaces } from 'inversify';
import Bind = interfaces.Bind;
import Runnable, { RUNNABLE } from '../foundation/runnable';
import Connector from './connector';
import config from '../config';
import { Connection, ConnectionManager } from 'typeorm';
import { createClient, RedisClient } from 'redis';
import { getLogger } from '../logger';
import Kernel from '../foundation/kernel';

export const databaseModule = new ContainerModule((bind: Bind) => {
    bind<Runnable>(RUNNABLE).to(Connector);

    bind<ConnectionManager>(ConnectionManager)
        .toDynamicValue(() => new ConnectionManager())
        .inSingletonScope();

    bind<Connection>(Connection)
        .toDynamicValue(({container}) =>
            container.get(ConnectionManager).create(config.database.drivers[config.database.driver]))
        .inSingletonScope();

    bind<RedisClient>(RedisClient)
        .toDynamicValue(({container}) => {
            const client = createClient(6379, 'localhost');
            const logger = getLogger('redis');
            client.on('error', e => {
                logger.error(e.toString());
                container.get(Kernel).terminate(1);
            });

            return client;
        })
        .inSingletonScope();
});
