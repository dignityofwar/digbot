import {Module} from '@nestjs/common';
import {MessengerController} from './messenger.controller';
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
        MessengerController,

        SettingsController,
    ],
})
export class MessengerModule {
}
