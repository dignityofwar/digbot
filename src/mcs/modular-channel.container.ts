import {Injectable} from '@nestjs/common';
import {GroupState} from './states/group.state';
import {ChannelState} from './states/channel.state';
import {remove} from '../utils/array.utils';
import EventEmitter from 'events';

@Injectable()
export class ModularChannelContainer extends EventEmitter {
    private readonly channelIndex = new Map<string, [GroupState, ChannelState]>();
    private readonly parentIndex = new Map<string, GroupState>();

    constructor() {
        super();
    }

    fromChannel(id: string): [GroupState, ChannelState] | undefined {
        return this.channelIndex.get(id);
    }

    fromParent(id: string): GroupState | undefined {
        return this.parentIndex.get(id);
    }

    addGroup(group: GroupState): void {
        for (const channel of group.channelStates)
            this.channelIndex.set(channel.channelId, [group, channel]);

        if (group.parentId)
            this.parentIndex.set(group.parentId, group);

        this.emit('groupAdded', group);
    }

    removeGroup(group: GroupState): void {
        for (const channel of group.channelStates)
            this.channelIndex.delete(channel.channelId);

        if (group.parentId)
            this.parentIndex.delete(group.parentId);

        this.emit('groupRemoved', group);
    }

    addChannel(group: GroupState, channel: ChannelState): void {
        group.channelStates.push(channel);
        this.channelIndex.set(channel.channelId, [group, channel]);

        this.emit('channelAdded', channel, group);
    }

    removeChannel(group: GroupState, channel: ChannelState): void {
        remove(group.channelStates, channel);
        this.channelIndex.delete(channel.channelId);

        this.emit('channelRemoved', channel, group);
    }
}