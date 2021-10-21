import {Module} from '@nestjs/common';
import {DiscordCoreModule} from './foundation/discord-core.module';
import {DiscordAccessor} from './helpers/discord.accessor';
import {MemberUpdateAccessor} from './helpers/member-update.accessor';
import {GuildController} from './http/guild.controller';
import {GuildSyncService} from './services/guild-sync.service';

@Module({
    imports: [
        DiscordCoreModule,
    ],
    providers: [
        DiscordAccessor,
        MemberUpdateAccessor,
        GuildSyncService,
    ],
    controllers: [
        GuildController,
    ],
    exports: [
        DiscordCoreModule,
        DiscordAccessor,
        MemberUpdateAccessor,
    ],
})
export class DiscordModule {
}
