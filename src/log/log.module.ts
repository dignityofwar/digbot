import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {LogSettings} from './entities/log-settings.entity';
import {LogService} from './log.service';
import {DiscordModule} from '../discord/discord.module';
import {LogSettingsController} from './log-settings.controller';

@Module({
    imports: [
        TypeOrmModule.forFeature([LogSettings]),
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