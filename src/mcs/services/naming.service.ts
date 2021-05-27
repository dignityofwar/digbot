import {Injectable} from '@nestjs/common';
import {McsService} from '../mcs.service';
import {Group} from '../models/group';
import {ChannelState} from '../models/channel.state';
import {McsEvents} from '../mcs.constants';
import Timeout = NodeJS.Timeout;
import {NamingOnJoinContract} from '../models/naming/concerns/naming-on-join.contract';

@Injectable()
export class NamingService {
    private static readonly RENAME_EMPTY_DELAY = 10 * 1000;
    private static readonly RENAME_JOIN_DELAY = 2 * 1000;


    private readonly queued = new Map<ChannelState, Timeout>();

    constructor(
        private readonly mcsService: McsService,
    ) {
        this.prepareListeners();
    }

    private prepareListeners(): void {
        this.mcsService.on(McsEvents.GROUP_ADDED, this.onGroupAdd.bind(this));
        this.mcsService.on(McsEvents.GROUP_REMOVED, this.onGroupRemove.bind(this));
        this.mcsService.on(McsEvents.GROUP_OCCUPATION_CHANGE, this.onGroupOccupationChange.bind(this));

        this.mcsService.on(McsEvents.CHANNEL_ADDED, this.onChannelAdded.bind(this));
        this.mcsService.on(McsEvents.CHANNEL_REMOVED, this.onChannelRemoved.bind(this));
    }

    planRenameEmpty(state: ChannelState): void {
        this.planRenameTo(
            state,
            state.group.naming.forChannel(state),
            NamingService.RENAME_EMPTY_DELAY,
        );
    }

    planRenameJoin(state: ChannelState): void {
        if ('getChannelNameOnJoin' in state.group.naming)
            this.planRenameTo(
                state,
                (state.group.naming as NamingOnJoinContract).getChannelNameOnJoin(state),
                NamingService.RENAME_JOIN_DELAY,
            );
    }

    cancelRename(state: ChannelState): void {
        const job = this.queued.get(state);
        if (!job) return;

        clearTimeout(job);
        this.queued.delete(state);
    }

    private planRenameTo(state: ChannelState, name: string, delay: number): void {
        this.cancelRename(state);

        this.queued.set(
            state,
            setTimeout(() => {
                if (state.channel.name != name)
                    void state.channel.setName(name, 'Modular Channel System: reset name');
            }, delay)
                .unref(),
        );
    }

    private reevaluate(state: ChannelState): void {
        if (state.isEmpty) {
            state.canBeRenamed = true;
            state.owner = null;

            this.planRenameEmpty(state);
        } else if (state.canBeRenamed) {
            state.canBeRenamed = false;
            state.owner = state.channel.members.first();

            this.planRenameJoin(state);
        }
    }

    onGroupAdd(group: Group): void {
        for (const state of group.channels) {
            if (state.isEmpty)
                this.planRenameEmpty(state);
        }
    }

    onGroupRemove(group: Group): void {
        for (const state of group.channels)
            this.cancelRename(state);
    }

    onGroupOccupationChange(group: Group, channels: ChannelState[]): void {
        for (const state of channels)
            this.reevaluate(state);
    }


    onChannelAdded(state: ChannelState): void {
        this.reevaluate(state);
    }

    onChannelRemoved(state: ChannelState): void {
        this.cancelRename(state);
    }
}
