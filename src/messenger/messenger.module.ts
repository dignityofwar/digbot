import {Module} from '@nestjs/common';
import {MessengerController} from './messenger.controller';
import {DiscordModule} from '../discord/discord.module';
import {SettingsService} from './settings.service';
import {DatabaseModule} from '../database/database.module';

@Module({
    imports: [
        DiscordModule,
        DatabaseModule,
    ],
    providers: [
        SettingsService,
    ],
    controllers: [
        MessengerController,
    ],
})
export class MessengerModule {
}
