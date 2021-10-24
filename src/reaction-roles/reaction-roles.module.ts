import {Logger, Module} from '@nestjs/common';
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
        {
            provide: Logger,
            useFactory: () => new Logger('ReactionRolesModule'),
        },
    ],
    controllers: [
        SettingsController,
    ],
})
export class ReactionRolesModule {
}
