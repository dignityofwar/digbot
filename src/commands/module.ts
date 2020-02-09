import { ContainerModule, interfaces } from 'inversify';
import Bind = interfaces.Bind;
import Handler from '../bot/handler';
import CommandHandler from './foundation/commandhandler';

export default new ContainerModule((bind: Bind) => {
    bind<Handler>(Handler).to(CommandHandler);
});
