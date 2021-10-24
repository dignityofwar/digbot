import {Logger, Module} from '@nestjs/common';
import {MessengerController} from './controllers/messenger.controller';
import {SettingsService} from './services/settings.service';
import {SettingsController} from './http/settings.controller';
import {DiscordModule} from '../discord/discord.module';
import {RateLimitModule} from '../utils/ratelimit/rate-limit.module';

@Module({
    imports: [
        DiscordModule,
        RateLimitModule,
    ],
    providers: [
        SettingsService,
        MessengerController,
        {
            provide: Logger,
            useFactory: () => new Logger('MessengerModule'),
        },
    ],
    controllers: [
        SettingsController,
    ],
})
export class MessengerModule {
}
