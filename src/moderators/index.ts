import { ContainerModule, interfaces } from 'inversify';
import Bind = interfaces.Bind;
import Handler from '../bot/Handler';
import Antispamhandler from './antispam/AntiSpamHandler';

export default new ContainerModule((bind: Bind) => {
    bind<Antispamhandler>(Antispamhandler).to(Antispamhandler);
});
