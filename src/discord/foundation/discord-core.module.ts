import {MetadataAccessor} from './helpers/metadata.accessor';
import {DiscordExplorer} from './services/discord.explorer';
import {Logger, Module} from '@nestjs/common';
import {DiscoveryModule} from '@nestjs/core';
import {discordConfig} from '../../config/discord.config';
import {ClusterClient} from 'detritus-client';
import {Client as RestClient} from 'detritus-client-rest';
import {DiscordManager} from './services/discord.manager';

@Module({
    imports: [
        DiscoveryModule,
    ],
    providers: [
        MetadataAccessor,
        DiscordExplorer,
        DiscordManager,
        {
            provide: ClusterClient,
            useFactory: () => new ClusterClient(
                discordConfig.token,
                {
                    gateway: {
                        reconnectMax: Infinity,
                        intents: 14219,
                    },
                    cache: {
                        guilds: true,
                        roles: true,
                        channels: true,
                        emojis: true,
                        members: true,
                    },
                }),
        },
        {
            provide: RestClient,
            useFactory: (discord: ClusterClient) => discord.rest,
            inject: [ClusterClient],
        },
        {
            provide: Logger,
            useFactory: () => new Logger('DiscordCoreModule'),
        },
    ],
    exports: [
        ClusterClient,
        RestClient,
    ],
})
export class DiscordCoreModule {
}
