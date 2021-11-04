import {FastifyAdapter, NestFastifyApplication} from '@nestjs/platform-fastify';
import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {Logger, ValidationPipe} from '@nestjs/common';
import {loggerConfig} from './config/logger.config';
import {useContainer} from 'class-validator';

(async function bootstrap() {
    const logger = new Logger('App');

    const app = await NestFactory.create<NestFastifyApplication>(
        AppModule,
        new FastifyAdapter(),
        {
            logger: loggerConfig.levels,
        },
    );

    // Validation
    useContainer(app, {fallbackOnErrors: true});
    app.use(new ValidationPipe({transform: true}));

    // Error handling
    process
        .on('uncaughtException', async (err) => {
            logger.error(err.message ?? err, err.stack);

            await app.close();
            process.exit(1);
        });

    app.enableShutdownHooks();

    await app.listen(3000, '0.0.0.0');
})();
