import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {LogSettings} from './entities/log-settings.entity';
import {LogService} from './log.service';
import {DiscordModule} from '../discord/discord.module';

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
})
export class LogModule {
}