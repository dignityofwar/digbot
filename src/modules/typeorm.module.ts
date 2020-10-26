import { TypeOrmModule as BaseTypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { ConfigModule } from './config.module';
import { DatabaseConfig } from '../config/database.config';

export const TypeOrmModule = BaseTypeOrmModule.forRootAsync({
    imports: [ConfigModule, DatabaseConfig],
    useFactory: (config: ConfigService) => ({
        ...config.get('database'),
        entities: [],
    }),
    inject: [ConfigService],
});
