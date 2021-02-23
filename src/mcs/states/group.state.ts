import {Group} from '../entities/group.entity';
import {ChannelState} from './channel.state';
import {remove} from '../../utils/array.utils';

export class GroupState {
    deleted = false;

    public readonly channelStates: ChannelState[] = [];

    constructor(
        public readonly group: Group,
    ) {
    }

    get empty(): ChannelState[] {
        return this.channelStates.filter((state) => !state.occupied);
    }

    get parentId(): string | undefined {
        return this.group.parentId;
    }

    get tare(): number {
        return Math.max(
            this.empty.length - this.group.minFreeChannels,
            this.channelStates.length - this.group.maxChannels,
        );
    }

    addChannel(channel: ChannelState): void {
        this.channelStates.push(channel);
    }

    removeChannel(channel: ChannelState): void {
        remove(this.channelStates, channel);
    }
}