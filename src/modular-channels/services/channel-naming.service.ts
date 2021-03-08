import {Injectable, Logger} from '@nestjs/common';
import {GroupState} from '../states/group.state';
import {ChannelState} from '../states/channel.state';
import {RenameChannel} from '../jobs/rename-channel.job';
import {ChannelManager, VoiceChannel} from 'discord.js';
import {DiscordClient} from '../../discord/foundation/discord.client';

@Injectable()
export class ChannelNamingService {
    private static readonly logger = new Logger('ChannelNamingService');

    private readonly channelManager: ChannelManager;


    private readonly queue = new Map<ChannelState, RenameChannel>();

    constructor(
        discordClient: DiscordClient,
    ) {
        this.channelManager = discordClient.channels;
    }

    reevaluate(groupState: GroupState): void {
        for (const channelState of groupState.channelStates)
            void this.reevaluateChannel(channelState);
    }

    async reevaluateChannel(channelState: ChannelState): Promise<void> {
        if (channelState.occupied || channelState.name == this.getName(channelState))
            this.cancel(channelState);
        else
            this.planRename(channelState);
    }

    async cancelAll(groupState: GroupState): Promise<void> {
        for (const channelState of groupState.channelStates)
            this.cancel(channelState);
    }

    async cancel(channelState: ChannelState): Promise<void> {
        const job = this.queue.get(channelState);

        if (!job) return;

        if (!job.cancel())
            await job.cancel();
        else
            ChannelNamingService.logger.verbose(`Cancel naming job for channel "${channelState.channelId}`);

        this.queue.delete(channelState);
    }

    planRename(channelState: ChannelState): void {
        if (!this.queue.has(channelState)) {
            ChannelNamingService.logger.verbose(`Plan to rename channel "${channelState.channelId}"`);

            this.queue.set(channelState, new RenameChannel(this, channelState));
        }
    }

    async renameChannel(channelState: ChannelState): Promise<void> {
        try {
            const name = this.getName(channelState);

            ChannelNamingService.logger.verbose(`Renaming channel "${channelState.channelId}" to "${name}"`);

            const voiceChannel = await this.channelManager.fetch(channelState.channelId) as VoiceChannel;
            voiceChannel.setName(name);
        } catch (err) {
            ChannelNamingService.logger.warn(`An error occurred while renaming channel "${channelState.channelId}": ${err}`);
        }
    }

    getNextName(groupState: GroupState): string {
        return `${groupState.group.format} ${groupState.channelStates.length + 1}`;
    }

    getName(channelState: ChannelState): string {
        const {groupState} = channelState;
        const no = groupState.channelStates.filter(({position}) => position < channelState.position).length + 1;

        return `${groupState.group.format} ${no}`;
    }
}
