import { ContainerModule, interfaces } from 'inversify';
import Bind = interfaces.Bind;
import Runnable, { RUNNABLE } from '../foundation/runnable';
import Connector from './connector';
import config from '../config';
import { Connection, ConnectionManager } from 'typeorm';

export const databaseModule = new ContainerModule((bind: Bind) => {
    bind<Runnable>(RUNNABLE).to(Connector);

    bind<ConnectionManager>(ConnectionManager).toDynamicValue(() => new ConnectionManager()).inSingletonScope();
    bind<Connection>(Connection).toDynamicValue((context) => context.container.get(ConnectionManager).create(config.database.drivers[config.database.driver])).inSingletonScope();
});
