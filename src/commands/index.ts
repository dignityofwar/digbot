import { ContainerModule, interfaces } from 'inversify';
import Bind = interfaces.Bind;
import Handler from '../bot/handler';
import CommandHandler from './foundation/commandhandler';
import Command from './foundation/command';
import CatsCommand from './catscommand';
import Executor from './foundation/executor';
import TriviaCommand from './triviacommand';

export const commandModule =  new ContainerModule((bind: Bind) => {
    bind<Executor>(Executor).toSelf().inSingletonScope();
    bind<Handler>(Handler).to(CommandHandler);

    bind<Command>(Command).to(CatsCommand);
    bind<Command>(Command).to(TriviaCommand);
});
