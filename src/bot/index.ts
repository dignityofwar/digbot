import { ContainerModule, interfaces } from 'inversify';
import Bind = interfaces.Bind;
import Runnable, { RUNNABLE } from '../foundation/Runnable';
import Bot from './Bot';
import { Client, Guild } from 'discord.js';
import defaultLogger, { getLogger } from '../logger';
import { CloseEvent } from 'ws';
import config from '../config';

export default new ContainerModule((bind: Bind) => {
    bind<Runnable>(RUNNABLE).to(Bot);

    bind<string>('discordToken').toConstantValue(config.discord.token).whenInjectedInto(Bot);

    bind<Client>(Client).toDynamicValue((): Client => {
        const client = new Client();
        const logger = getLogger('discord-client');
        const shardLabel = (shardID: number): string => `discord-shard-${shardID}`;

        // TODO: implement clientUserGuildSettingsUpdate, and clientUserSettingsUpdate maybe
        // TODO: investigate the invalidated event
        client.on('debug', (info: string) => logger.silly(info));
        client.on('error', (error: Error) => logger.error(error.message));
        client.on('guildUnavailable', (guild: Guild) => logger.info(`Guild became unavailable: ${guild.name}(${guild.id})`));
        client.on('rateLimit', (info) => logger.debug(`Rate limit reached: ${JSON.stringify(info)}`));
        client.on('ready', () => logger.info('Client ready'));
        client.on('warn', (warning: string) => logger.warn(warning));

        client.on('shardDisconnect', (event: CloseEvent, shardID: number) => defaultLogger.info({
            message: `Shard disconnected: ${event.reason}(${event.code})`,
            label: shardLabel(shardID),
        }));
        client.on('shardError', (error: Error, shardID: number) => defaultLogger.error({
            message: error.message,
            label: shardLabel(shardID),
        }));
        client.on('shardReady', (shardID: number) => defaultLogger.info({ // unavailableGuilds?: Set<string>
            message: 'Shard ready',
            label: shardLabel(shardID),
        }));
        client.on('shardReconnecting', (shardID: number) => defaultLogger.debug({
            message: 'Client reconnecting',
            label: shardLabel(shardID),
        }));
        client.on('shardResume', (replayed: number, shardID: number) => defaultLogger.info({
            message: `Client resumed: ${replayed}`,
            label: shardLabel(shardID),
        }));


        return client;
    }).inSingletonScope();
});
