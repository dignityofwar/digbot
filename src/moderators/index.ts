import { ContainerModule, interfaces } from 'inversify';
import Bind = interfaces.Bind;
import Handler from '../bot/handler';
import AntiSpam from './antispam';

export default new ContainerModule((bind: Bind) => {
    bind<Handler>(Handler).to(AntiSpam);
});
