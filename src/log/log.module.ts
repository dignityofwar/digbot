import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {LogSettings} from './entities/log-settings.entity';
import {LogService} from './log.service';
import {LogSettingsService} from './services/log-settings.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([LogSettings]),
    ],
    providers: [
        LogService,
        LogSettingsService,
    ],
    exports: [
        LogService,
    ],
})
export class LogModule {
}