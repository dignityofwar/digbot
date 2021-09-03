import {Module} from '@nestjs/common';
import {ReactionRolesController} from './reaction-roles.controller';
import {DiscordModule} from '../discord/discord.module';
import {SettingsService} from './settings.service';
import {SettingsController} from './http/settings.controller';

@Module({
    imports: [
        DiscordModule,
    ],
    providers: [
        SettingsService,
    ],
    controllers: [
        ReactionRolesController,

        SettingsController,
    ],
})
export class ReactionRolesModule {
}
