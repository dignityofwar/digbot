import {DiscordClient} from '../../discord/foundation/discord.client';
import {ChannelManager, GuildManager} from 'discord.js';
import {GroupState} from '../states/group.state';
import {CreateChannel} from '../jobs/create-channel.job';
import {DeleteChannel} from '../jobs/delete-channel.job';
import {ModularChannelContainer} from '../modular-channel.container';
import {ChannelState} from '../states/channel.state';
import {GroupService} from './group.service';
import {Injectable, Logger} from '@nestjs/common';
import {ChannelNamingService} from './channel-naming.service';

@Injectable()
export class ChannelAllocationService {
    private static readonly logger = new Logger('ChannelAllocationService');

    private readonly guildManager: GuildManager;
    private readonly channelManager: ChannelManager;

    private readonly queue = new Map<GroupState, CreateChannel | DeleteChannel>();

    constructor(
        private readonly container: ModularChannelContainer,
        private readonly groupService: GroupService,
        private readonly namingService: ChannelNamingService,
        discordClient: DiscordClient,
    ) {
        this.guildManager = discordClient.guilds;
        this.channelManager = discordClient.channels;
    }

    reevaluate(groupState: GroupState): void {
        setImmediate(() => {
            if (groupState.tare > 0)
                this.planDelete(groupState);
            else if (groupState.tare < 0)
                this.planCreate(groupState);
            else
                void this.cancelAllocation(groupState);
        });
    }

    async cancelAllocation(groupState: GroupState): Promise<void> {
        const job = this.queue.get(groupState);
        if (!job) return;

        if (!job.cancel())
            await job.await();
        else
            ChannelAllocationService.logger.verbose(`Cancel allocation job for group "${groupState.group.id}"`)

        this.queue.delete(groupState);
    }

    private planCreate(groupState: GroupState): void {
        const job = this.queue.get(groupState);

        if (job instanceof CreateChannel) return;
        if (job && (job.triggered || job.cancel())) return;

        ChannelAllocationService.logger.verbose(`Plan new channel for group "${groupState.group.id}"`)

        this.queue.set(groupState, new CreateChannel(this, groupState));
    }

    async create(groupState: GroupState): Promise<void> {
        const guild = await this.guildManager.fetch(groupState.group.guildId);
        const {group} = groupState;

        ChannelAllocationService.logger.verbose(`Creating channel for group "${groupState.group.id}"`);

        const position = groupState.channelStates.length
            ? Math.max(...groupState.channelStates.map(({position}) => position))
            : group.position;

        const createdChannel = await guild.channels.create(
            this.namingService.getNextName(groupState), {
                type: 'voice',
                parent: group.parentId,
                userLimit: group.userLimit,
                position,
            });

        const channel = await this.groupService.createChannel({
            channelId: createdChannel.id,
            group,
        });

        this.container.addChannel(new ChannelState(groupState, channel, createdChannel));
        this.queue.delete(groupState);

        if (!groupState.deleted)
            this.reevaluate(groupState);
    }

    private planDelete(groupState: GroupState): void {
        const job = this.queue.get(groupState);

        if (job instanceof DeleteChannel) return;
        if (job && (job.triggered || job.cancel())) return;

        ChannelAllocationService.logger.verbose(`Plan removal channel for group "${groupState.group.id}"`)

        this.queue.set(groupState, new DeleteChannel(this, groupState));
    }

    async delete(groupState: GroupState): Promise<void> {
        const nominated = groupState.empty.reduce((nominee, candidate) => nominee.position > candidate.position ? nominee : candidate);

        ChannelAllocationService.logger.verbose(`Deleting channel "${nominated.channelId}" for group "${groupState.group.id}"`)

        const channel = await this.channelManager.fetch(nominated.channelId);
        await channel.delete(`MCS: Channel expired`);

        this.groupService.deleteChannel(nominated.channel);
        this.queue.delete(groupState);

        if (!groupState.deleted)
            this.reevaluate(groupState);
    }
}