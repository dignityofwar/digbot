import { ContainerModule, interfaces } from 'inversify';
import Bind = interfaces.Bind;
import Runnable, { RUNNABLE } from '../foundation/runnable';
import Connector from './connector';
import config from '../config';

export const databaseModule = new ContainerModule((bind: Bind) => {
    bind<Runnable>(RUNNABLE).to(Connector);

    bind<DatabaseDriverOption>('driverConfig').toConstantValue(config.database().drivers[config.database().driver])
});
