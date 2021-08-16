import {Module} from '@nestjs/common';
import {DiscordModule} from './discord/discord.module';
import {CommandModule} from './commands/command.module';
import {ReactionRolesModule} from './reaction-roles/reaction-roles.module';
import {MessengerModule} from './messenger/messenger.module';
import {DatabaseModule} from './database/database.module';

@Module({
    imports: [
        DatabaseModule,
        DiscordModule,
        CommandModule,
        ReactionRolesModule,
        MessengerModule,
    ],
})
export class AppModule {
}
