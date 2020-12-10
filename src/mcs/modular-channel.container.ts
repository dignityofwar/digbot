import { Injectable } from '@nestjs/common';
import { Snowflake } from 'discord.js';
import { DynamicChannelEntity } from './entities/dynamic-channel.entity';

@Injectable()
export class ModularChannelContainer {
    private readonly channels = new Map<Snowflake, DynamicChannelEntity>();

    hasChannel(id: Snowflake): boolean {
        return this.channels.has(id);
    }

    getChannel(id: Snowflake): DynamicChannelEntity {
        if (!this.hasChannel(id)) throw new Error('Channel does not exist');

        return this.channels.get(id);
    }

    registerChannel(channel: DynamicChannelEntity): void {
        this.channels.set(channel.channel, channel);
    }
}
