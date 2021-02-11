import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {LogSettings} from './entities/log-settings.entity';
import {LogService} from './log.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([LogSettings]),
    ],
    providers: [
        LogService,
    ],
    exports: [
        LogService,
    ]
})
export class LogModule {
}