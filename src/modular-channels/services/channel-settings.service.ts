import {Injectable, Logger} from '@nestjs/common';
import {ChannelManager, VoiceChannel} from 'discord.js';
import {GroupState} from '../states/group.state';

@Injectable()
export class ChannelSettingsService {
    private static readonly logger = new Logger('ChannelSettingsService');

    constructor(
        private readonly channelManager: ChannelManager,
    ) {
    }

    syncSettings(groupState: GroupState, channel: VoiceChannel) {
        for (const channelState of groupState.channelStates) {
            if (channelState.channelId == channel.id)
                continue;

            this.channelManager.fetch(channelState.channelId)
                .then((to) => {
                    if (to instanceof VoiceChannel)
                        void this.copySettings(channel, to);
                });
        }
    }

    private async copySettings(from: VoiceChannel, to: VoiceChannel) {
        try {
            await Promise.all([
                to.overwritePermissions(from.permissionOverwrites),
                to.setBitrate(from.bitrate),
                to.setUserLimit(from.userLimit),
            ]);
        } catch (err) {
            ChannelSettingsService.logger.warn(`Unable to sync settings to ${to.id}: ${err}`);
        }
    }
}
