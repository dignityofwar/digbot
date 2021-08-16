import {PrismaClient} from '@prisma/client';
import {Injectable, OnModuleDestroy, OnModuleInit} from '@nestjs/common';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    private shutdownResolve: () => void;
    private shutdownPromise: Promise<void>;

    async onModuleInit() {
        this.shutdownPromise = new Promise((resolve) => {
            this.shutdownResolve = resolve;
        });

        this.$on('beforeExit', async () => {
            await this.shutdownPromise;
        });

        await this.$connect();
    }

    onModuleDestroy() {
        this.shutdownResolve();
    }
}