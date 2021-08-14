import {MetadataAccessor} from './helpers/metadata.accessor';
import {DiscordExplorer} from './discord.explorer';
import {DiscordClient} from './discord.client';
import {Module} from '@nestjs/common';
import {ChannelManager, GuildManager} from 'discord.js';
import {DiscoveryModule} from '@nestjs/core';
import {REST} from '@discordjs/rest';
import {discordConfig} from '../config/discord.config';

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
                token: discordConfig.token,
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
        {
            provide: REST,
            useFactory: () => new REST({version: '9'})
                .setToken(discordConfig.token),
        },
    ],
    exports: [
        DiscordClient,
        ChannelManager,
        GuildManager,
        REST,
    ],
})
export class DiscordModule {
}
