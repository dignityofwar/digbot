import {Module} from '@nestjs/common';
import {MessengerController} from './controllers/messenger.controller';
import {SettingsService} from './services/settings.service';
import {SettingsController} from './http/settings.controller';
import {DiscordModule} from '../discord/discord.module';

@Module({
    imports: [
        DiscordModule,
    ],
    providers: [
        SettingsService,
        MessengerController,
    ],
    controllers: [
        SettingsController,
    ],
})
export class MessengerModule {
}
