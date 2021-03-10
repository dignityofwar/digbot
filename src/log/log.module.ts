import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {DiscordModule} from '../discord/discord.module';
import {LogService} from './log.service';
import {LogSettingsController} from './controllers/log-settings.controller';
import {LogSettings} from './entities/log-settings.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            LogSettings,
        ]),
        DiscordModule,
    ],
    providers: [
        LogService,
    ],
    exports: [
        LogService,
    ],
    controllers: [
        LogSettingsController,
    ],
})
export class LogModule {
}