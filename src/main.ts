import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { crashOnUnhandledRejection } from './app/helper.utils';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        logger: ['error', 'warn', 'log', 'verbose'],
    });

    app.enableShutdownHooks();
    crashOnUnhandledRejection();

    await app.listen(3000);
}

void bootstrap();
