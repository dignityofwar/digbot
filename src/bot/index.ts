import { ContainerModule, interfaces } from 'inversify';
import Bind = interfaces.Bind;
import Runnable, { RUNNABLE } from '../foundation/runnable';
import Bot from './bot';
import { Client, Guild, RateLimitData } from 'discord.js';
import defaultLogger, { getLogger } from '../logger';
import { CloseEvent } from 'ws';

export const botModule = new ContainerModule((bind: Bind) => {
    bind<Runnable>(RUNNABLE).to(Bot);

    bind<Client>(Client).toDynamicValue((): Client => {
        const client = new Client();
        const logger = getLogger('discord-client');
        const shardLabel = (shardID: number) => `discord-shard-${shardID}`;

        // TODO: implement clientUserGuildSettingsUpdate, and clientUserSettingsUpdate maybe
        client.on('debug', (info: string) => logger.silly(info));
        client.on('error', (error: Error) => logger.error(error.message));
        client.on('guildUnavailable', (guild: Guild) => logger.info(`Guild became unavailable: ${guild.name}(${guild.id})`));
        client.on('rateLimit', (info: RateLimitData) => logger.debug(`Rate limit reached: ${JSON.stringify(info)}`));
        client.on('ready', () => logger.info('Client ready'));
        client.on('warn', (warning: string) => logger.warn(warning));

        client.on('shardDisconnected', (event: CloseEvent, shardID: number) => defaultLogger.info({
            message: `Shard disconnected: ${event.reason}(${event.code})`,
            label: shardLabel(shardID),
        }));
        client.on('shardError', (error: Error, shardID: number) => defaultLogger.error({
            message: error.message,
            label: shardLabel(shardID),
        }));
        client.on('shardReady', (shardID: number, unavailableGuilds?: Set<string>) => defaultLogger.info({
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
