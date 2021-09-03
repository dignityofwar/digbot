import {Module} from '@nestjs/common';
import {SettingsService} from './settings.service';
import {RoleHierarchyController} from './role-hierarchy.controller';
import {DiscordModule} from '../discord/discord.module';
import {SettingsController} from './http/settings.controller';

@Module({
    imports: [
        DiscordModule,
    ],
    providers: [
        SettingsService,
    ],
    controllers: [
        RoleHierarchyController,

        SettingsController,
    ],
})
export class RoleHierarchyModule {
}
