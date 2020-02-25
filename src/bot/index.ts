import { ContainerModule, interfaces } from 'inversify';
import Bind = interfaces.Bind;
import Runnable, { RUNNABLE } from '../foundation/runnable';
import Bot from './bot';
import { Client, Guild, RateLimitInfo } from 'discord.js';
import Context = interfaces.Context;
import { childLogger } from '../logger/logger';

export const botModule = new ContainerModule((bind: Bind) => {
    bind<Runnable>(RUNNABLE).to(Bot);

    bind<Client>(Client).toDynamicValue((context: Context): Client => {
        const client = new Client({
            disabledEvents: ['TYPING_START'],
        });
        const logger = childLogger('discord-client');

        // clientUserGuildSettingsUpdate
        // clientUserSettingsUpdate
        client.on('debug', (info: string) => logger.silly(info));
        client.on('disconnect', (event: CloseEvent) => logger.info(`Client disconnected: ${event.reason}(${event.code})`));
        client.on('error', (error: Error) => logger.error(error.message));
        client.on('guildUnavailable', (guild: Guild) => logger.info(`Guild became unavailable: ${guild.name}(${guild.id})`));
        client.on('rateLimit', (info: RateLimitInfo) => logger.debug(`Rate limit reached: ${JSON.stringify(info)}`));
        client.on('ready', () => logger.info('Client ready'));
        client.on('reconnecting', () => logger.debug('Client reconnecting'));
        client.on('resume', (replayed: number) => logger.info(`Client resumed: ${replayed}`));
        client.on('warn', (warning: string) => logger.warn(warning));

        return client;
    }).inSingletonScope();
});
