import {Injectable, Logger, OnModuleInit} from '@nestjs/common';
import {MikroORM} from '@mikro-orm/core';

@Injectable()
export class MigrationService implements OnModuleInit {
    private static readonly logger = new Logger('MigrationService');

    constructor(
        private readonly orm: MikroORM,
    ) {
    }

    async onModuleInit(): Promise<void> {
        if (process.env.AUTO_MIGRATE && process.env.AUTO_MIGRATE.trim().toUpperCase() == 'TRUE') {
            const migrations = await this.orm.getMigrator().up();

            if (migrations.length > 0)
                MigrationService.logger.log('Successfully migrated database');
        }
    }
}
