import {Module} from '@nestjs/common';
import {ReactionRolesController} from './controllers/reaction-roles.controller';
import {SettingsService} from './services/settings.service';
import {SettingsController} from './http/settings.controller';
import {DiscordModule} from '../discord/discord.module';

@Module({
    imports: [
        DiscordModule,
    ],
    providers: [
        SettingsService,
        ReactionRolesController,
    ],
    controllers: [
        SettingsController,
    ],
})
export class ReactionRolesModule {
}
