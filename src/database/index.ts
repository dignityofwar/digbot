import { ContainerModule, interfaces } from 'inversify';
import Bind = interfaces.Bind;
import Runnable, { RUNNABLE } from '../foundation/Runnable';
import Connector from './Connector';
import config from '../config';
import { Connection, ConnectionManager, EntityManager } from 'typeorm';
import { createClient, RedisClient } from 'redis';
import { getLogger } from '../logger';
import Kernel from '../foundation/Kernel';
import RateLimiter, { RATELIMITER } from '../utils/ratelimiter/RateLimiter';
import RedisRateLimiter from '../utils/ratelimiter/RedisRateLimiter';

export default new ContainerModule((bind: Bind) => {
    bind<Runnable>(RUNNABLE).to(Connector);

    /** TypeORM */
    bind<ConnectionManager>(ConnectionManager)
        .toDynamicValue(() => new ConnectionManager())
        .inSingletonScope();

    bind<Connection>(Connection)
        .toDynamicValue(({container}) =>
            container.get(ConnectionManager).create(config.database.drivers[config.database.driver]))
        .inSingletonScope();

    bind<EntityManager>(EntityManager)
        .toDynamicValue(({container}) => container.get(Connection).manager)
        .inSingletonScope();

    /** Redis */
    bind<RedisClient>(RedisClient)
        .toDynamicValue(({container}) => {
            const client = createClient(config.redis.port, config.redis.host, config.redis.options);
            const logger = getLogger('redis');
            client.on('error', e => {
                logger.error(e.toString());
                container.get(Kernel).terminate(1);
            });

            return client;
        })
        .inSingletonScope();

    /** Registers a the rate limiter used by the whole app */
    bind<RateLimiter>(RATELIMITER).to(RedisRateLimiter);
});
