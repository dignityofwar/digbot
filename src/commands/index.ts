import { ContainerModule, interfaces } from 'inversify';
import Handler from '../bot/handler';
import CommandHandler from './commandhandler';
import Action from './action';
import Executor from './executor';
import CaseInsensitiveMap from '../utils/caseinsensitivemap';
import Throttle, { ThrottleType } from '../models/throttle';
import Bind = interfaces.Bind;
import Context = interfaces.Context;

import Cats from './actions/cats';
import Trivia from './actions/trivia';

export default new ContainerModule((bind: Bind) => {
    bind<Executor>(Executor).toSelf().inSingletonScope();
    bind<Handler>(Handler).to(CommandHandler);

    /** Registers a map with all the actions for the executor */
    bind<Map<string, Action>>(Map).toDynamicValue((context: Context) => {
        const repository = new CaseInsensitiveMap<Action>();

        context.container.getAll(Action)
            .forEach((action: Action) => repository.set(action.name, action));

        return repository;
    }).whenInjectedInto(Executor);

    /** Registers the default throttle used by the executor */
    bind<Throttle>(Throttle).toDynamicValue(() => {
        const throttle = new Throttle();
        throttle.decay = 5;
        throttle.max = 5;
        throttle.type = ThrottleType.CHANNEL;

        return throttle;
    }).whenInjectedInto(Executor);

    /** Command actions that will be injected into the action map of the executor */
    bind<Action>(Action).to(Cats);
    bind<Action>(Action).to(Trivia);
});
