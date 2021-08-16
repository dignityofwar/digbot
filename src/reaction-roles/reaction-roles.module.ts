import {Module} from '@nestjs/common';
import {ReactionRolesController} from './reaction-roles.controller';
import {DiscordModule} from '../discord/discord.module';
import {SettingsService} from './settings.service';
import {DatabaseModule} from '../database/database.module';

@Module({
    imports: [
        DiscordModule,
        DatabaseModule,
    ],
    providers: [
        SettingsService,
    ],
    controllers: [
        ReactionRolesController,
    ],
})
export class ReactionRolesModule {
}
