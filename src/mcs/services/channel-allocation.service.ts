import {DiscordClient} from '../../discord/foundation/discord.client';
import {ChannelManager, GuildManager} from 'discord.js';
import {GroupState} from '../states/group.state';
import {CreateChannel} from '../jobs/create-channel.job';
import {DeleteChannel} from '../jobs/delete-channel.job';
import {ModularChannelContainer} from '../modular-channel.container';
import {ChannelState} from '../states/channel.state';
import {GroupService} from './group.service';

export class ChannelAllocationService {
    private readonly guildManager: GuildManager;
    private readonly channelManager: ChannelManager;

    private readonly queue = new Map<GroupState, CreateChannel | DeleteChannel>();

    constructor(
        private readonly container: ModularChannelContainer,
        private readonly groupService: GroupService,
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
    }

    private planCreate(groupState: GroupState): void {
        const job = this.queue.get(groupState);

        if (job instanceof CreateChannel) return;
        if (job && (job.triggered || job.cancel())) return;

        this.queue.set(groupState, new CreateChannel(this, groupState));
    }

    async create(groupState: GroupState): Promise<void> {
        const guild = await this.guildManager.fetch(groupState.group.guildId);
        const {group} = groupState;

        const createdChannel = await guild.channels.create(group.format, {
            type: 'voice',
            parent: group.parentId,
            userLimit: group.userLimit,
            position: group.position,
        });

        const channel = this.groupService.createChannel({
            id: createdChannel.id,
            group,
        });

        this.container.addChannel(groupState, new ChannelState(channel, createdChannel));
        this.queue.delete(groupState);

        if (!groupState.deleted)
            this.reevaluate(groupState);
    }

    private planDelete(groupState: GroupState): void {
        const job = this.queue.get(groupState);

        if (job instanceof DeleteChannel) return;
        if (job && (job.triggered || job.cancel())) return;

        this.queue.set(groupState, new DeleteChannel(this, groupState));
    }

    async delete(groupState: GroupState): Promise<void> {
        const nominated = groupState.empty.reduce((nominee, candidate) => nominee.position > candidate.position ? nominee : candidate);

        const channel = await this.channelManager.fetch(nominated.channelId);
        await channel.delete(`MCS: Channel expired`);

        this.groupService.deleteChannel(nominated.channel);
        this.queue.delete(groupState);

        if (!groupState.deleted)
            this.reevaluate(groupState);
    }
}