import { ContainerModule, interfaces } from 'inversify';
import Bind = interfaces.Bind;
import Handler from '../bot/handler';
import CommandHandler from './foundation/commandhandler';
import Command from './foundation/command';
import CatsCommand from './catscommand';
import Commander from './foundation/commander';

export default new ContainerModule((bind: Bind) => {
    bind<Commander>(Commander).toSelf().inSingletonScope();
    bind<Handler>(Handler).to(CommandHandler);

    bind<Command>(Command).to(CatsCommand);
});
