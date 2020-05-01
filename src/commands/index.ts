import { ContainerModule, interfaces } from 'inversify';
import Bind = interfaces.Bind;
import Handler from '../bot/handler';
import CommandHandler from './foundation/commandhandler';
import Action from './foundation/action';
import Cats from './actions/cats';
import Executor from './foundation/executor';
import Trivia from './actions/trivia';
import Context = interfaces.Context;
import CaseInsensitiveMap from '../utils/caseinsensitivemap';
import RateLimiter, { RATELIMITER } from '../utils/ratelimiter/ratelimiter';
import RedisRateLimiter from '../utils/ratelimiter/redisratelimiter';

// type ABCAction = [string, Action];

export const commandModule = new ContainerModule((bind: Bind) => {
    bind<Executor>(Executor).toSelf().inSingletonScope();
    bind<Handler>(Handler).to(CommandHandler);

    bind<Map<string, Action>>(Map).toDynamicValue((context: Context) => {
        const repository = new CaseInsensitiveMap<Action>();

        context.container.getAll(Action)
            .forEach((action: Action) => repository.set(action.name, action));

        return repository;
    }).whenInjectedInto(Executor);

    bind<RateLimiter>(RATELIMITER).to(RedisRateLimiter);

    bind<Action>(Action).to(Cats);
    bind<Action>(Action).to(Trivia);
});
