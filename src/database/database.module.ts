import {MikroOrmModule} from '@mikro-orm/nestjs';
import {MigrationService} from './services/migration.service';
import {Module} from '@nestjs/common';

@Module({
    imports: [
        MikroOrmModule.forRoot(),
    ],
    providers: [
        MigrationService,
    ],
    exports: [
        MikroOrmModule,
    ],
})
export class DatabaseModule {
}
