import {Logger, Module} from '@nestjs/common';
import {SettingsService} from './services/settings.service';
import {RoleHierarchyController} from './controllers/role-hierarchy.controller';
import {SettingsController} from './http/settings.controller';
import {DiscordModule} from '../discord/discord.module';

@Module({
    imports: [
        DiscordModule,
    ],
    providers: [
        SettingsService,
        RoleHierarchyController,
        {
            provide: Logger,
            useFactory: () => new Logger('RoleHierarchyModule'),
        },
    ],
    controllers: [
        SettingsController,
    ],
})
export class RoleHierarchyModule {
}
