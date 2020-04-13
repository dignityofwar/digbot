import { ContainerModule, interfaces } from 'inversify';
import Bind = interfaces.Bind;
import Runnable, { RUNNABLE } from '../foundation/runnable';
import Connector from './connector';
import config from '../config';
import { DatabaseDriverOptions } from '../config/database';

export const databaseModule = new ContainerModule((bind: Bind) => {
    bind<Runnable>(RUNNABLE).to(Connector);

    bind<DatabaseDriverOptions>('driverConfig').toConstantValue(config.database().drivers[config.database().driver]).whenInjectedInto(Connector);
});
