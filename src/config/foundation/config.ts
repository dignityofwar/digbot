import {configStorage} from './storage';
import {classToClass} from 'class-transformer';
import {validateOrReject} from 'class-validator';
import {config as loadEnv} from 'dotenv';
import {Logger} from '@nestjs/common';

// Load .env file
loadEnv();

process.env.REDIS_PORT = '-123';

export interface ConfigConstruct<T> {
    new(): T;
}

export function config<T extends object>(construct: ConfigConstruct<T>): Readonly<T> {
    const logger = new Logger('config');

    const instance = new construct();

    // Fill instance
    for (const property of configStorage.getEnvProperties(construct)) {
        const options = configStorage.getEnvMetadata(construct, property);

        if (options && process.env[options.env]) {
            instance[property] = process.env[options.env];
            console.log(instance[property]);
        }
    }

    // Transform
    const transformedInstance = classToClass(instance);

    // Validate
    validateOrReject(transformedInstance)
        .catch(err => {
            logger.error(err);

            process.exit(1);
        });

    return Object.freeze(transformedInstance);
}
