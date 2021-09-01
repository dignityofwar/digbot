import {Module} from '@nestjs/common';
import {CommandModule} from './commands/command.module';
import {ReactionRolesModule} from './reaction-roles/reaction-roles.module';
import {MessengerModule} from './messenger/messenger.module';
import {DatabaseModule} from './database/database.module';
import {DiscordModule} from './discord/discord.module';
import {AutoRolesModule} from './auto-roles/auto-roles.module';

@Module({
    imports: [
        DatabaseModule,
        DiscordModule,
        CommandModule,
        ReactionRolesModule,
        MessengerModule,
        AutoRolesModule,
    ],
})
export class AppModule {
}
