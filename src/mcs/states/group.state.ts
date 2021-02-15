import {Group} from '../entities/group.entity';
import {ChannelState} from './channel.state';

export class GroupState {
    deleted = false;

    constructor(
        public readonly group: Group,
        public readonly channelStates: ChannelState[],
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
}