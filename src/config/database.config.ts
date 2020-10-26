import { ConfigModule, registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const DatabaseConfig = ConfigModule.forFeature(
    registerAs('database', (): TypeOrmModuleOptions => ({
        type: 'sqlite',
    })),
);
