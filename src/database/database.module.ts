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

    private shutdownPromise: Promise<void>;

    private shutdownResolve: () => void;

    constructor(
        private readonly prisma: PrismaClient,
    ) {
    }

    onModuleInit() {
        DatabaseModule.logger.log('Connecting');

        this.shutdownPromise = new Promise((resolve) => {
            this.shutdownResolve = resolve;
        });

        this.prisma.$on('beforeExit', async () => {
            await this.shutdownPromise;

            DatabaseModule.logger.log('Disconnect and clean-up');
        });

        this.prisma.$connect();
    }

    onApplicationShutdown() {
        this.shutdownResolve();
    }
}
