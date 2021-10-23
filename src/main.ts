import {FastifyAdapter, NestFastifyApplication} from '@nestjs/platform-fastify';
import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {Logger} from '@nestjs/common';
import {loggerConfig} from './config/logger.config';

(async function bootstrap() {
    const logger = new Logger('App');

    const app = await NestFactory.create<NestFastifyApplication>(
        AppModule,
        new FastifyAdapter(),
        {
            logger: loggerConfig.levels,
        },
    );

    process
        .on('uncaughtException', async (err) => {
            logger.error(err.message ?? err, err.stack);

            await app.close();
            process.exit(1);
        })
        .on('unhandledRejection', async (err) => {
            throw err;
        });

    app.enableShutdownHooks();

    await app.listen(3000, '0.0.0.0');
})();
