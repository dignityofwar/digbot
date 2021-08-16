import {Module} from '@nestjs/common';
import {MessengerController} from './messenger.controller';
import {DiscordModule} from '../discord/discord.module';
import {SettingsService} from './settings.service';

@Module({
    imports: [
        DiscordModule,
        SettingsService,
    ],
    controllers: [
        MessengerController,
    ],
})
export class MessengerModule {
}
