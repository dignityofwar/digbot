import { ContainerModule, interfaces } from 'inversify';
import Bind = interfaces.Bind;
import Runnable, { RUNNABLE } from '../foundation/runnable';
import Connector from './connector';

export const databaseModule = new ContainerModule((bind: Bind) => {
    bind<Runnable>(RUNNABLE).to(Connector);
});
