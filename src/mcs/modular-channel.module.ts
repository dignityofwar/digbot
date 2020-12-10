import { Module } from '@nestjs/common';
import { ModularChannelController } from './modular-channel.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DynamicChannelEntity } from './entities/dynamic-channel.entity';
import { DynamicGroupEntity } from './entities/dynamic-group.entity';
import { DiscordModule } from '../discord/discord.module';
import { ModularChannelService } from './modular-channel.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            DynamicChannelEntity,
            DynamicGroupEntity,
        ]),
        DiscordModule,
    ],
    providers: [ModularChannelService],
    controllers: [ModularChannelController],
})
export class ModularChannelModule {}
