import {Injectable, Logger, OnModuleInit} from '@nestjs/common';
import {MikroORM} from '@mikro-orm/core';

@Injectable()
export class MigrationService implements OnModuleInit {
    private static readonly logger = new Logger('MigrationService');

    constructor(
        private readonly orm: MikroORM,
    ) {
    }

    async onModuleInit() {
        if (process.env.NODE_ENV == 'development') return;

        const migrations = await this.orm.getMigrator().up();

        if (migrations.length > 0)
            MigrationService.logger.log('Successfully migrated database');
    }
}
