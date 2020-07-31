import { ContainerModule, interfaces } from 'inversify';
import Handler from '../bot/Handler';
import CommandHandler from './CommandHandler';
import Action from './Action';
import Executor from './Executor';
import CaseInsensitiveMap from '../utils/maps/CaseInsensitiveMap';
import Throttle, { ThrottleType } from '../models/Throttle';
import Bind = interfaces.Bind;
import Context = interfaces.Context;

import Cats from './actions/Cats';
import Trivia from './actions/Trivia';

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
