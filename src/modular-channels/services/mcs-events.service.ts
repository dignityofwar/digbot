import {Injectable} from '@nestjs/common';
import {CategoryChannel, VoiceChannel} from 'discord.js';
import {ChannelState} from '../states/channel.state';
import {GroupState} from '../states/group.state';
import {ModularChannelContainer} from '../modular-channel.container';
import {ChannelAllocationService} from './channel-allocation.service';
import {ChannelNamingService} from './channel-naming.service';
import {ChannelPositionService} from './channel-position.service';
import {GroupService} from './group.service';
import {ChannelSettingsService} from './channel-settings.service';

@Injectable()
export class MCSEventsService {
    constructor(
        private readonly container: ModularChannelContainer,
        private readonly allocationService: ChannelAllocationService,
        private readonly namingService: ChannelNamingService,
        private readonly positionService: ChannelPositionService,
        private readonly settingsService: ChannelSettingsService,
        private readonly groupService: GroupService,
    ) {
    }

    updateOccupationChannel(channel: VoiceChannel): void {
        const channelState = this.container.fromChannel(channel.id);
        if (!channelState) return;

        const occupied = channel.members.size > 0;
        if (channelState.occupied == occupied) return;

        channelState.occupied = occupied;
        this.allocationService.reevaluate(channelState.groupState);
        void this.namingService.reevaluateChannel(channelState);

    }

    updateChannel(channel: VoiceChannel): void {
        const channelState = this.container.fromChannel(channel.id);

        if (channelState) {
            this.updateMCSChannel(channelState, channel);

            return;
        }

        const groupState = channel.parentID
            ? this.container.fromParent(channel.parentID)
            : this.container.fromRootGuild(channel.guild.id);

        if (groupState)
            this.updateNearMCSChannel(groupState);
    }

    private updateMCSChannel(channelState: ChannelState, channel: VoiceChannel): void {
        if (channelState.groupState.parentId !== channel.parentID) {
            this.container.removeChannel(channelState);
            this.groupService.deleteChannel(channelState.channel);

            this.allocationService.reevaluate(channelState.groupState);

            return;
        }

        channelState.name = channel.name;

        if (channelState.position != channel.rawPosition) {
            channelState.position = channel.rawPosition;

            void this.positionService.reevaluate(channelState.groupState);
        }

        this.settingsService.syncSettings(channelState.groupState, channel);
        void this.namingService.reevaluate(channelState.groupState);
    }

    private updateNearMCSChannel(groupState: GroupState): void {
        void this.namingService.reevaluate(groupState);
    }

    deleteChannel(channel: VoiceChannel): void {
        const channelState = this.container.fromChannel(channel.id);
        if (!channelState) return;

        void this.namingService.cancel(channelState);

        this.container.removeChannel(channelState);
        this.groupService.deleteChannel(channelState.channel);

        this.allocationService.reevaluate(channelState.groupState);
        this.namingService.reevaluate(channelState.groupState);
    }

    deleteParent(channel: CategoryChannel): void {
        const groupState = this.container.fromParent(channel.id);
        if (!groupState) return;

        void this.namingService.cancelAll(groupState);
        void this.allocationService.cancelAllocation(groupState);

        this.container.removeGroup(groupState);
        this.groupService.deleteGroup(groupState.group);
    }
}
