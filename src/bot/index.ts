import { ContainerModule, interfaces } from 'inversify';
import Bind = interfaces.Bind;
import Runnable from '../foundation/runnable';
import Bot from './bot';

export default new ContainerModule((bind: Bind) => {
    bind<Runnable>(Runnable).to(Bot).inSingletonScope();
});
