import {MetadataAccessor} from './helpers/metadata.accessor';
import {DiscordExplorer} from './discord.explorer';
import {DiscordClient} from './discord.client';
import {Module} from '@nestjs/common';
import {ChannelManager, GuildManager} from 'discord.js';
import {DiscoveryModule} from '@nestjs/core';

@Module({
    imports: [
        DiscoveryModule,
    ],
    providers: [
        MetadataAccessor,
        DiscordExplorer,
        {
            provide: DiscordClient,
            useFactory: () => new DiscordClient({
                token: process.env.DISCORD_TOKEN,
                intents: 14151,
            }),
        }, {
            provide: ChannelManager,
            useFactory: (client: DiscordClient) => client.channels,
            inject: [DiscordClient],
        }, {
            provide: GuildManager,
            useFactory: (client: DiscordClient) => client.guilds,
            inject: [DiscordClient],
        },
    ],
    exports: [
        DiscordClient,
        ChannelManager,
        GuildManager,
    ],
})
export class DiscordModule {
}
