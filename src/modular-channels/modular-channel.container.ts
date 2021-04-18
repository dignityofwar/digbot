import {Injectable} from '@nestjs/common';
import {GroupState} from './states/group.state';
import {ChannelState} from './states/channel.state';
import {remove} from '../utils/array.utils';

@Injectable()
export class ModularChannelContainer {
    private readonly channelIndex = new Map<string, ChannelState>();
    private readonly parentIndex = new Map<string, GroupState>();
    private readonly rootIndex = new Map<string, GroupState>();
    private readonly guildIndex = new Map<string, Set<GroupState>>();

    fromGuild(id: string): GroupState[] {
        return Array.from(this.guildIndex.get(id) ?? []);
    }

    fromChannel(id: string): ChannelState | undefined {
        return this.channelIndex.get(id);
    }

    fromRootGuild(id: string): GroupState | undefined {
        return this.rootIndex.get(id);
    }

    fromParent(id: string): GroupState | undefined {
        return this.parentIndex.get(id);
    }

    addGroup(group: GroupState): void {
        for (const channel of group.channelStates)
            this.channelIndex.set(channel.channelId, channel);

        if (group.parentId)
            this.parentIndex.set(group.parentId, group);
        else
            this.rootIndex.set(group.guildId, group);

        let guildSet = this.guildIndex.get(group.guildId);

        if (!guildSet) {
            guildSet = new Set();
            this.guildIndex.set(group.guildId, guildSet);
        }

        guildSet.add(group);
    }

    removeGroup(group: GroupState): void {
        for (const channel of group.channelStates)
            this.channelIndex.delete(channel.channelId);

        if (group.parentId)
            this.parentIndex.delete(group.parentId);
        else
            this.rootIndex.delete(group.guildId);

        const guildSet = this.guildIndex.get(group.guildId);

        if (guildSet)
            guildSet.delete(group);
    }

    addChannel(channel: ChannelState): void {
        channel.groupState.channelStates.push(channel);
        this.channelIndex.set(channel.channelId, channel);
    }

    removeChannel(channel: ChannelState): void {
        remove(channel.groupState.channelStates, channel);
        this.channelIndex.delete(channel.channelId);
    }
}