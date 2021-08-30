import {MikroOrmModule} from '@mikro-orm/nestjs';
import {MigrationService} from './migration.service';

export const DatabaseModule = MikroOrmModule.forRoot();

if (!DatabaseModule.providers)
    DatabaseModule.providers = [];

DatabaseModule.providers.push(MigrationService);
