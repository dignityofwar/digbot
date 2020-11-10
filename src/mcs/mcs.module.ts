import { Module } from '@nestjs/common';
import { McsController } from './mcs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DynamicChannelEntity } from './entities/dynamic-channel.entity';
import { DynamicGroupEntity } from './entities/dynamic-group.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            DynamicChannelEntity,
            DynamicGroupEntity,
        ]),
    ],
    controllers: [McsController],
})
export class McsModule {
}
