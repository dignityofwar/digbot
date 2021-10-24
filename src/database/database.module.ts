import {MikroOrmModule} from '@mikro-orm/nestjs';
import {MigrationService} from './services/migration.service';
import {Logger, Module} from '@nestjs/common';

@Module({
    imports: [
        MikroOrmModule.forRoot(),
    ],
    providers: [
        MigrationService,
        {
            provide: Logger,
            useFactory: () => new Logger('DatabaseModule'),
        },
    ],
    exports: [
        MikroOrmModule,
    ],
})
export class DatabaseModule {
}
