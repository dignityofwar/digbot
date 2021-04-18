import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        logger: ['error', 'warn', 'log', 'verbose'],
    });

    app.enableShutdownHooks();

    process.on('unhandledRejection', (err) => {
        throw err;
    });

    await app.listen(3000);
}

void bootstrap();
