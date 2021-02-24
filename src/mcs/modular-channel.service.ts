import {Injectable, Logger, OnApplicationBootstrap} from '@nestjs/common';
import {CategoryChannel, ChannelManager, VoiceChannel} from 'discord.js';
import {DiscordClient} from '../discord/foundation/discord.client';
import {ModularChannelContainer} from './modular-channel.container';
import {GroupState} from './states/group.state';
import {Group} from './entities/group.entity';
import {GroupService} from './services/group.service';
import {ChannelAllocationService} from './services/channel-allocation.service';
import {ChannelState} from './states/channel.state';
import {ChannelNamingService} from './services/channel-naming.service';

@Injectable()
export class ModularChannelService implements OnApplicationBootstrap {
    private static readonly logger = new Logger('ModularChannelSystem');

    private readonly channelManager: ChannelManager;

    constructor(
        private readonly container: ModularChannelContainer,
        private readonly allocationService: ChannelAllocationService,
        private readonly namingService: ChannelNamingService,
        private readonly groupService: GroupService,
        private readonly discordClient: DiscordClient,
    ) {
        this.channelManager = discordClient.channels;
    }

    onApplicationBootstrap(): void {
        this.discordClient.once('ready', async () => {
            void this.initService();
        });
    }

    private async initService(): Promise<void> {
        ModularChannelService.logger.log('Initializing');

        const groups = await this.groupService.getAll();

        await Promise.all(
            groups.map((group) => this.initGroup(group)),
        );

        ModularChannelService.logger.log(`Initialized ${groups.length} groups`);
    }

    private async initGroup(group: Group): Promise<void> {
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
                ModularChannelService.logger.log(`Unable to retrieve parent "${group.parentId}": ${err}`);
                this.groupService.deleteGroup(group);
            }
        } else {
            await this.initChannelsRoot(groupState);

            this.container.addGroup(groupState);
            this.allocationService.reevaluate(groupState);
        }

        this.namingService.reevaluate(groupState);
        // TODO: Evaluate positions
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

    updateOccupationChannel(channel: VoiceChannel): void {
        const channelState = this.container.fromChannel(channel.id);
        if (!channelState) return;

        const occupied = channel.members.size > 0;
        if (channelState.occupied == occupied) return;

        channelState.occupied = occupied;
        this.allocationService.reevaluate(channelState.groupState);
        void this.namingService.renameChannel(channelState);

    }

    updateChannel(channel: VoiceChannel): void {
        const channelState = this.container.fromChannel(channel.id);
        if (!channelState) return;

        if (channelState.groupState.parentId !== channel.parentID) {
            this.container.removeChannel(channelState);
            this.groupService.deleteChannel(channelState.channel);

            this.allocationService.reevaluate(channelState.groupState);

            return;
        }

        channelState.position = channel.rawPosition;
        // TODO: Evaluate position

        void this.namingService.reevaluate(channelState.groupState);
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
