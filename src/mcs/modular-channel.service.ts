import {Group} from './entities/group.entity';
import {Injectable, Logger, OnApplicationBootstrap} from '@nestjs/common';
import {GroupService} from './services/group.service';
import {Channel} from './entities/channel.entity';
import {ModularChannelContainer} from './modular-channel.container';
import {CategoryChannel, ChannelManager, Guild, GuildManager, VoiceChannel} from 'discord.js';
import {empty, unique} from '../utils/filter.utils';
import {DiscordClient} from '../discord/foundation/discord.client';

export enum JobType {
    DELETE = 1,
    CREATE = 2,
}

@Injectable()
export class ModularChannelService implements OnApplicationBootstrap {
    private static readonly logger = new Logger('ModularChannelSystem');

    private readonly channelManager: ChannelManager;
    private readonly guildManager: GuildManager;

    constructor(
        private readonly container: ModularChannelContainer,
        private readonly groupService: GroupService,
        private readonly discordClient: DiscordClient,
    ) {
        this.channelManager = discordClient.channels;
        this.guildManager = discordClient.guilds;
    }

    onApplicationBootstrap(): void {
        this.discordClient.once('ready', () => {
            this.initService();
        });
    }

    initService(): void {
        this.groupService.getAll()
            .then(groups => {
                ModularChannelService.logger.log(`Initializing ${groups.length} group(s)`);

                groups.forEach(group =>
                    this.initGroup(group),
                )
            });
    }

    async initGroup(group: Group): Promise<void> {
        await Promise.all(
            group.channels.map(channel => this.initChannel(channel)),
        );

        await this.initParent(group);

        // Validate channels
        group.channels
            .filter(({voiceChannel}) => voiceChannel.parentID != group.parentId)
            .forEach((channel) => this.container.deleteChannel(channel));

        group.channels
            .filter(({voiceChannel}) =>
                group.channels.some((member) => voiceChannel.position - member.voiceChannel.position == 1)
                && group.channels.some((member) => voiceChannel.position - member.voiceChannel.position == -1),
            )
            .forEach((channel) => this.container.deleteChannel(channel));

        group.guild = await this.guildManager.fetch(group.guildId);
        this.allocate(group);
        this.container.initGroup(group);
    }

    async initParent(group: Group): Promise<void> {
        try {
            await this.channelManager.fetch(group.parentId);
        } catch (err) {
            ModularChannelService.logger.warn(`Unable to fetch category "${group.parentId}": ${err}`);

            this.container.updateGroup(group, {parentId: undefined})
        }
    }

    async initChannel(channel: Channel): Promise<void> {
        try {
            channel.voiceChannel = await this.channelManager.fetch(channel.id) as VoiceChannel;
        } catch (err) {
            ModularChannelService.logger.warn(`Unable to fetch channel "${channel.id}": ${err}`);

            channel.removeFromGroup();
        }
    }

    notifyChange(channels: VoiceChannel[]): void {
        channels
            .map(channel => this.container.getChannel(channel))
            .filter(empty)
            .map(({group}) => group)
            .filter(unique)
            .forEach(group => {
                this.allocate(group);
            });
    }

    channelMoved(voiceChannel: VoiceChannel): void {
        const channel = this.container.getChannel(voiceChannel);

        if (channel) {
            const {group} = channel;

            const adjacent = group.parentId == voiceChannel.parentID
                && group.channels.some((member) => Math.abs(member.voiceChannel.position - voiceChannel.position) == 1)

            if (adjacent) {
                // Rename channels
            } else {
                this.container.deleteChannel(channel);
                this.planCreate(group);
            }
        }
    }

    channelDeleted(voiceChannel: VoiceChannel): void {
        const channel = this.container.getChannel(voiceChannel);

        if (channel)
            this.container.deleteChannel(channel);
    }

    parentDeleted(category: CategoryChannel): void {
        this.container.getGroupsFromParent(category)
            .forEach(group => {
                const position = group.channels.reduce(
                    (nominated, candidate) =>
                        nominated < candidate.voiceChannel.position
                            ? nominated
                            : candidate.voiceChannel.position, 0)

                this.container.updateGroup(group, {
                    parentId: undefined,
                    position,
                })
            });
    }

    createGroup(guild: Guild, options: Partial<Group>): void { // TODO: Add DTO for options
        const group = Object.assign(new Group(), options);

        group.guild = guild;
        group.guildId = guild.id;
        group.channels = [];

        this.container.addGroup(group);
        void this.createChannel(group);
    }

    deleteGroup(group: Group, releaseChannels = true) {
        this.container.deleteGroup(group);

        if (!releaseChannels)
            group.channels.forEach(({voiceChannel}) => {
                voiceChannel.delete('Group deleted without channel release')
                    .catch((err) => {
                        ModularChannelService.logger.warn(`Unable to delete channel "${voiceChannel.id}" from deleted group: ${err}`)
                    })
            });
    }

    allocate(group: Group): void {
        const {tare} = group;

        if (tare > 0)
            this.planDelete(group)
        else if (tare < 0)
            this.planCreate(group);
        else
            this.cancelDeleteOrCreate(group);
    }

    private planDelete(group: Group): void {
        const [type, job] = group.queued ?? [];

        if (type && type !== JobType.DELETE)
            clearTimeout(job);

        if (!type || type !== JobType.DELETE) {
            group.queued = [
                JobType.DELETE,
                setTimeout(() => {
                    delete group.queued;
                    void this.deleteChannel(group);
                }, group.deletionDelay * 1000).unref(),
            ];
        }
    }

    private async deleteChannel(group: Group): Promise<void> {
        const channel = group.emptyChannels
            .reduce((nominated, candidate) =>
                nominated.voiceChannel.position > candidate.voiceChannel.position
                    ? nominated
                    : candidate,
            );

        try {
            await channel.voiceChannel.delete('Channel expired');
            this.container.deleteChannel(channel);

            if (group.tare > 0)
                this.planDelete(group);
        } catch (err) {
            ModularChannelService.logger.warn(`Unable to delete channel "${channel.id}": ${err}`);
        }
    }

    private planCreate(group: Group): void {
        const [type, job] = group.queued ?? [];

        if (type && type !== JobType.CREATE)
            clearTimeout(job);

        if (!type || type !== JobType.CREATE) {
            group.queued = [
                JobType.CREATE,
                setTimeout(() => {
                    delete group.queued;
                    void this.createChannel(group);
                }, group.creationDelay * 1000).unref(),
            ]
        }
    }

    private async createChannel(group: Group): Promise<void> {
        try {
            const voiceChannel = await group.guild.channels.create(group.format, {
                type: 'voice',
                parent: group.parentId,
                position: group.position,
                userLimit: group.userLimit,
            });

            const channel = new Channel();
            channel.id = voiceChannel.id;
            channel.group = group;
            channel.voiceChannel = voiceChannel;

            this.container.addChannel(channel);

            if (group.tare < 0)
                this.planCreate(group);
        } catch (err) {
            ModularChannelService.logger.warn(`Unable to create new channel in group "${group.id}": ${err}`)
        }
    }

    private cancelDeleteOrCreate(group: Group): void {
        const [, job] = group.queued ?? [];

        if (job) {
            clearTimeout(job);
            delete group.queued;
        }
    }
}
