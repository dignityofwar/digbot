import {Module} from '@nestjs/common';
import {ReactionRolesController} from './reaction-roles.controller';
import {DiscordModule} from '../discord/discord.module';
import {SettingsService} from './settings.service';

@Module({
    imports: [
        DiscordModule,
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
