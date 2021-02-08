import {Group} from './entities/group.entity';
import {Injectable, Logger, OnApplicationBootstrap} from '@nestjs/common';
import {GroupService} from './services/group.service';
import {Channel} from './entities/channel.entity';
import {ModularChannelContainer} from './modular-channel.container';
import {ChannelManager, GuildManager, VoiceChannel} from 'discord.js';
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
        discordClient: DiscordClient
    ) {
        this.channelManager = discordClient.channels;
        this.guildManager = discordClient.guilds;
    }

    onApplicationBootstrap(): void {
        setTimeout(() => {
            this.initService();
        }, 2000);
    }

    initService(): void {
        this.groupService.getAll()
            .then(groups =>
                groups.forEach(group =>
                    this.initGroup(group)
                )
            );
    }

    async initGroup(group: Group): Promise<void> {
        await Promise.all(
            group.channels.map(channel => this.initChannel(channel))
        );

        group.guild = await this.guildManager.fetch(group.snowflake);
        this.allocate(group);
        this.container.initGroup(group);
    }

    async initChannel(channel: Channel): Promise<void> {
        try {
            channel.channel = await this.channelManager.fetch(channel.snowflake) as VoiceChannel;
        } catch (e) {
            ModularChannelService.logger.log(`Unable to fetch channel "${channel.snowflake}": ${e}`);

            channel.removeFromGroup();
        }
    }

    notifyChange(channels: VoiceChannel[]): void {
        channels
            .map(({id}) => this.container.getChannel(id))
            .filter(empty)
            .map(({group}) => group)
            .filter(unique)
            .forEach(group => {
                this.allocate(group);
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
                    void this.deleteChannel(group);
                }, group.deletionDelay).unref()
            ];
        }
    }

    private async deleteChannel(group: Group): Promise<void> {
        const channel = group.emptyChannels
            .reduce((nominated, candidate) =>
                nominated.channel.position > candidate.channel.position
                    ? nominated
                    : candidate
            );

        try {
            await channel.channel.delete('Channel expired');
            this.container.deleteChannel(channel);

            if (group.tare > 0)
                this.planDelete(group);
        } catch (e) {
            ModularChannelService.logger.log(`Unable to delete channel "${channel.snowflake}": ${e}`);
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
                    void this.createChannel(group);
                }, group.creationDelay).unref()
            ]
        }
    }

    private async createChannel(group: Group): Promise<void> {
        try {
            const channel = await group.guild.channels.create(group.format, {
                type: 'voice',
                parent: group.parent,
                position: group.nextPosition
            });

            const entity = new Channel();

            entity.snowflake = channel.id;
            entity.group = group;
            entity.channel = channel;

            this.container.addChannel(entity);
        } catch (e) {
            ModularChannelService.logger.log(`Unable to create new channel in group "${group.id}": ${e}`)
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
