import {Injectable, Logger, OnApplicationBootstrap} from '@nestjs/common';
import {CategoryChannel, ChannelManager, VoiceChannel} from 'discord.js';
import {DiscordClient} from '../discord/foundation/discord.client';
import {ModularChannelContainer} from './modular-channel.container';
import {GroupState} from './states/group.state';
import {Group} from './entities/group.entity';
import {GroupService} from './services/group.service';
import {ChannelState} from './states/channel.state';
import {Channel} from './entities/channel.entity';
import {ChannelAllocationService} from './services/channel-allocation.service';

@Injectable()
export class ModularChannelService implements OnApplicationBootstrap {
    private static readonly logger = new Logger('ModularChannelSystem');

    private readonly channelManager: ChannelManager;

    constructor(
        private readonly container: ModularChannelContainer,
        private readonly allocationService: ChannelAllocationService,
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
        const groups = await this.groupService.getAll();

        await Promise.all(
            groups.map((group) => this.initGroup(group)),
        );
    }

    private async initGroup(group: Group): Promise<void> {
        this.container.addGroup(new GroupState(group, await this.initChannels(group.channels)));
    }

    private async initChannels(channels: Channel[]): Promise<ChannelState[]> {
        return (await Promise.all(
            channels.map<Promise<[Channel, VoiceChannel]>>(async (channel) => [
                channel,
                await this.channelManager.fetch(channel.id)
                    .catch((err) => {
                        ModularChannelService.logger.log(`Unable to retrieve VoiceChannel "${channel.id}": ${err}`);

                        this.groupService.deleteChannel(channel);
                    }) as VoiceChannel,
            ]),
        ))
            .filter(([, channel]) => channel)
            .map((args) => new ChannelState(...args));
    }

    updateOccupationChannel(channel: VoiceChannel): void {
        const state = this.container.fromChannel(channel.id);
        if (!state) return;
        const [groupState, channelState] = state;

        const occupied = channel.members.size > 0;
        if (channelState.occupied == occupied) return;

        channelState.occupied = occupied;
        this.allocationService.reevaluate(groupState);

        if (!occupied) {
            // Start renaming process
        }
    }

    updateChannel(channel: VoiceChannel): void {
        const state = this.container.fromChannel(channel.id);
        if (!state) return;
        const [groupState, channelState] = state;

        // Evaluate position
        channelState.position = channel.rawPosition;

        // Evaluate name
    }

    deleteChannel(channel: VoiceChannel): void {
        const state = this.container.fromChannel(channel.id);
        if (!state) return;
        const [groupState, channelState] = state;

        this.container.removeChannel(groupState, channelState);
        this.groupService.deleteChannel(channelState.channel);

        this.allocationService.reevaluate(groupState);
    }

    deleteParent(channel: CategoryChannel): void {
        const groupState = this.container.fromParent(channel.id);
        if (!groupState) return;

        this.container.removeGroup(groupState);
        this.groupService.deleteGroup(groupState.group);

        this.allocationService.cancelAllocation(groupState);
    }
}
