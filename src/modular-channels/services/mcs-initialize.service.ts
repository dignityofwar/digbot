import {Injectable, Logger} from '@nestjs/common';
import {Group} from '../entities/group.entity';
import {GroupState} from '../states/group.state';
import {CategoryChannel, ChannelManager, VoiceChannel} from 'discord.js';
import {ChannelState} from '../states/channel.state';
import {ModularChannelContainer} from '../modular-channel.container';
import {ChannelAllocationService} from './channel-allocation.service';
import {ChannelPositionService} from './channel-position.service';
import {ChannelNamingService} from './channel-naming.service';
import {GroupService} from './group.service';

@Injectable()
export class MCSInitializeService {
    private static readonly logger = new Logger('ModularChannelSystem');

    constructor(
        private readonly groupService: GroupService,
        private readonly container: ModularChannelContainer,
        private readonly allocationService: ChannelAllocationService,
        private readonly positionService: ChannelPositionService,
        private readonly namingService: ChannelNamingService,
        private readonly channelManager: ChannelManager,
    ) {
    }

    async initService(): Promise<void> {
        MCSInitializeService.logger.log('Initializing');

        const groups = await this.groupService.getAll();

        await Promise.all(
            groups.map((group) => this.initGroup(group)),
        );

        MCSInitializeService.logger.log(`Initialized ${groups.length} groups`);
    }

    async initGroup(group: Group): Promise<void> {
        const groupState = new GroupState(group);

        if (group.parentId) {
            try {
                await this.initChannelsWithParent(
                    groupState,
                    await this.channelManager.fetch(group.parentId) as CategoryChannel,
                );

                this.container.addGroup(groupState);
                this.allocationService.reevaluate(groupState);
            } catch (err) {
                MCSInitializeService.logger.log(`Unable to retrieve parent "${group.parentId}": ${err}`);
                this.groupService.deleteGroup(group);
            }
        } else {
            await this.initChannelsRoot(groupState);

            this.container.addGroup(groupState);
            this.allocationService.reevaluate(groupState);
        }

        this.namingService.reevaluate(groupState);
        this.positionService.reevaluate(groupState);
    }

    private async initChannelsRoot(groupState: GroupState): Promise<void> {
        const {group} = groupState;
        const {channels} = group;

        this.initChannels(
            groupState,
            (await Promise.all(
                channels.map((channel) =>
                    this.channelManager.fetch(channel.channelId)
                        .catch(() => {
                        }) as Promise<VoiceChannel | undefined>,
                ),
            ))
                .filter((channel) => channel && channel.parentID == group.parentId),
        );
    }

    private async initChannelsWithParent(groupState: GroupState, parent: CategoryChannel): Promise<void> {
        this.initChannels(
            groupState,
            parent.children.array()
                .filter((channel) => channel instanceof VoiceChannel) as VoiceChannel[],
        );
    }

    private initChannels(groupState: GroupState, voiceChannels: VoiceChannel[]): void {
        const {group} = groupState;
        const {channels} = group;

        for (const channel of channels) {
            const voiceChannel = voiceChannels.find(({id}) => id == channel.channelId);

            if (!voiceChannel) {
                this.groupService.deleteChannel(channel);
                continue;
            }

            groupState.addChannel(new ChannelState(groupState, channel, voiceChannel));
        }
    }
}