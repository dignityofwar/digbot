import {Injectable} from '@nestjs/common';
import {GroupState} from './states/group.state';
import {ChannelState} from './states/channel.state';
import {remove} from '../utils/array.utils';

@Injectable()
export class ModularChannelContainer {
    private readonly channelIndex = new Map<string, ChannelState>();
    private readonly parentIndex = new Map<string, GroupState>();

    fromChannel(id: string): ChannelState | undefined {
        return this.channelIndex.get(id);
    }

    fromParent(id: string): GroupState | undefined {
        return this.parentIndex.get(id);
    }

    addGroup(group: GroupState): void {
        for (const channel of group.channelStates)
            this.channelIndex.set(channel.channelId, channel);

        if (group.parentId)
            this.parentIndex.set(group.parentId, group);
    }

    removeGroup(group: GroupState): void {
        for (const channel of group.channelStates)
            this.channelIndex.delete(channel.channelId);

        if (group.parentId)
            this.parentIndex.delete(group.parentId);
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