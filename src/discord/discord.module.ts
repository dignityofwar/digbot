import {MetadataAccessor} from './helpers/metadata.accessor';
import {DiscordExplorer} from './discord.explorer';
import {Logger, Module, OnApplicationBootstrap, OnApplicationShutdown} from '@nestjs/common';
import {DiscoveryModule} from '@nestjs/core';
import {discordConfig} from '../config/discord.config';
import {ClusterClient, ShardClient} from 'detritus-client';
import {Client as RestClient} from 'detritus-client-rest';

@Module({
    imports: [
        DiscoveryModule,
    ],
    providers: [
        MetadataAccessor,
        DiscordExplorer,
        {
            provide: ClusterClient,
            useFactory: () => new ClusterClient(
                discordConfig.token,
                {
                    gateway: {
                        reconnectMax: Infinity,
                        intents: 14151,
                    },
                    cache: {
                        guilds: true,
                        members: true,
                        roles: true,
                    },
                }),
        },
        {
            provide: RestClient,
            useFactory: (discord: ClusterClient) => discord.rest,
            inject: [ClusterClient],
        },
    ],
    exports: [
        ClusterClient,
        RestClient,
    ],
})
export class DiscordModule implements OnApplicationBootstrap, OnApplicationShutdown {
    private static readonly logger = new Logger('DiscordClient');

    constructor(
        private readonly client: ClusterClient,
    ) {
        const shardLogger = new Logger();
        const _ = (shard: ShardClient) => `DiscordShard${shard.shardId}`;

        client
            .on('ready', () =>
                DiscordModule.logger.log('Client ready'))
            .on('shard', ({shard}) =>
                shardLogger.log('Shard ready', _(shard)))
            .on('warn', warn => {
                if ('shard' in warn)
                    shardLogger.warn(warn.error, _(warn.shard));
                else
                    DiscordModule.logger.warn(warn.error);
            })
            .on('killed', killed => {
                if ('shard' in killed)
                    killed.error
                        ? shardLogger.error(`Shard killed with error: ${killed.error.message}`, killed.error.stack, _(killed.shard))
                        : shardLogger.log('Shard killed', _(killed.shard));
                else
                    killed.error
                        ? DiscordModule.logger.error(`Client killed with error: ${killed.error.message}`, killed.error.stack)
                        : DiscordModule.logger.log('Client killed');
            })
            .on('unknown',
                payload => shardLogger.warn(`Unknown payload received: ${JSON.stringify(payload)}`, _(payload.shard)))
            .on('gatewayReady',
                ({shard}) => shardLogger.log('Shard ready', _(shard)))
            .on('gatewayResumed',
                ({shard}) => shardLogger.log('Shard resumed', _(shard)));
    }

    async onApplicationBootstrap(): Promise<void> {
        DiscordModule.logger.log('Connecting client');

        await this.client.run();

        DiscordModule.logger.log('Connected client');
    }

    onApplicationShutdown(): void {
        this.client.kill();

        DiscordModule.logger.log('Client destroyed');
    }
}
