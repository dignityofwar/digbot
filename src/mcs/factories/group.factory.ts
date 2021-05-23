import {Injectable} from '@nestjs/common';
import {Group} from '../models/group';
import {GroupSettings} from '../models/group-settings.entity';
import {CategoryChannel, ChannelManager, GuildManager} from 'discord.js';

@Injectable()
export class GroupFactory {
    constructor(
        private readonly guildManager: GuildManager,
        private readonly channelManager: ChannelManager,
    ) {
    }

    async create(settings: GroupSettings): Promise<Group> {
        const {guildId, parentId} = settings;

        return new Group(
            settings,
            await this.guildManager.fetch(guildId),
            parentId ? await this.channelManager.fetch(parentId) as CategoryChannel : undefined,
        );
    }
}
