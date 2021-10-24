import {Injectable, Logger, OnModuleInit} from '@nestjs/common';
import {MikroORM} from '@mikro-orm/core';

@Injectable()
export class MigrationService implements OnModuleInit {
    constructor(
        private readonly logger: Logger,
        private readonly orm: MikroORM,
    ) {
    }

    async onModuleInit(): Promise<void> {
        if (process.env.AUTO_MIGRATE && process.env.AUTO_MIGRATE.trim().toUpperCase() == 'TRUE') {
            this.logger.log('Attempting to migrate database');

            const migrations = await this.orm.getMigrator().up();

            if (migrations.length > 0)
                this.logger.log('Successfully migrated database');
        }
    }
}
