import { Repository } from 'typeorm';
import { DynamicChannelEntity } from './entities/dynamic-channel.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DynamicGroupEntity } from './entities/dynamic-group.entity';
import { DiscordClient } from '../discord/foundation/discord.client';
import { Injectable } from '@nestjs/common';
import { VoiceChannel } from 'discord.js';

@Injectable()
export class ModularChannelService {
    constructor(
        private readonly discordClient: DiscordClient,
        @InjectRepository(DynamicGroupEntity)
        private readonly groupRepository: Repository<DynamicGroupEntity>,
        @InjectRepository(DynamicChannelEntity)
        private readonly channelRepository: Repository<DynamicChannelEntity>,
    ) {}

    onModuleInit(): void {
        void this.channelRepository.update({}, {occupied: false});
    }

    async initChannel(channel: VoiceChannel): Promise<void> {
        const channelEntity = await this.channelRepository.findOne({channel: channel.id});


    }
}
