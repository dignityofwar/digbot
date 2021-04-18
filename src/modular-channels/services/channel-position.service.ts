import {Injectable, Logger} from '@nestjs/common';
import {GroupState} from '../states/group.state';
import {GuildManager, VoiceChannel} from 'discord.js';

@Injectable()
export class ChannelPositionService {
    private static readonly logger = new Logger('ChannelOrderService');

    constructor(
        private readonly guildManager: GuildManager,
    ) {
    }

    async reevaluate(groupState: GroupState) {
        if (groupState.channelStates.length) return;

        const [min, max] = groupState.channelStates.reduce(([min, max], {position}) =>
            [Math.min(min, position), Math.max(max, position)], [Infinity, -Infinity]);

        const channels = await this.fetchChannelsLeveL(groupState.guildId, groupState.parentId);

        channels.filter((channel) =>
            !groupState.channelStates.some((state) => state.channelId == channel.id))
            .filter(({rawPosition}) => min > rawPosition && rawPosition > max)
            .forEach((channel) => {
                channel.setPosition(min - 1)
                    .catch((err) => ChannelPositionService.logger.warn(`Unable to move channel "${channel.id}": ${err}`));
            });
    }

    private async fetchChannelsLeveL(guildId: string, parentId?: string): Promise<VoiceChannel[]> {
        const guild = await this.guildManager.fetch(guildId);

        return guild.channels.cache
            .filter((channel) => channel instanceof VoiceChannel && channel.parentID == parentId)
            .array() as VoiceChannel[];
    }
}
