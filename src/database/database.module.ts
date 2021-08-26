import {Logger, Module, OnApplicationShutdown, OnModuleInit} from '@nestjs/common';
import {PrismaClient} from '@prisma/client';

@Module({
    providers: [
        {
            provide: PrismaClient,
            useFactory: () => new PrismaClient(),
        },
    ],
    exports: [
        PrismaClient,
    ],
})
export class DatabaseModule implements OnModuleInit, OnApplicationShutdown {
    private static readonly logger = new Logger('PrismaClient');

    constructor(
        private readonly prisma: PrismaClient,
    ) {
        this.prisma.$on('beforeExit', () => new Promise(() => null));
    }

    async onModuleInit() {
        await this.prisma.$connect();

        DatabaseModule.logger.log('Connected');
    }

    async onApplicationShutdown() {
        this.prisma.$disconnect();

        DatabaseModule.logger.log('Disconnected');
    }
}
