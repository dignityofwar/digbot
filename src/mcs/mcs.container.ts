import {Injectable} from '@nestjs/common';
import {Group} from './models/group';
import {ChannelState} from './models/channel.state';
import {VoiceChannel} from 'discord.js';

@Injectable()
export class McsContainer {
    private readonly groups = new Map<number, Group>();
    private readonly channels = new Map<string, ChannelState>();

    getChannel(channel: string): ChannelState | null;
    getChannel(channel: VoiceChannel): ChannelState | null;
    getChannel(channel: string | VoiceChannel): ChannelState | null {
        if (channel instanceof VoiceChannel)
            channel = channel.id;

        return this.channels.get(channel) ?? null;
    }

    addGroup(group: Group): boolean {
        if (this.groups.has(group.id)) return false;

        this.groups.set(group.id, group);

        for (const channel of group.channels)
            this.channels.set(channel.channelId, channel);

        return true;
    }

    removeGroup(group: Group): void {
        this.groups.delete(group.id);

        for (const channelState of group.channels)
            this.channels.delete(channelState.channelId);
    }

    addChannel(channel: ChannelState): void {
        channel.group.channels.add(channel);

        this.channels.set(channel.channelId, channel);
    }

    removeChannel(channel: ChannelState): void {
        channel.group.channels.delete(channel);

        this.channels.delete(channel.channelId);
    }
}