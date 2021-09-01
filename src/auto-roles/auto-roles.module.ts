import {Module} from '@nestjs/common';
import {SettingsService} from './settings.service';
import {AutoRolesController} from './auto-roles.controller';
import {DiscordModule} from '../discord/discord.module';

@Module({
    imports: [
        DiscordModule,
    ],
    providers: [
        SettingsService,
    ],
    controllers: [
        AutoRolesController,
    ],
})
export class AutoRolesModule {
}
