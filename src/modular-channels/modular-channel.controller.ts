import {Controller} from '@nestjs/common';
import {CategoryChannel, Channel, PartialDMChannel, VoiceChannel, VoiceState} from 'discord.js';
import {On} from '../discord/decorators/on.decorator';
import {ModularChannelService} from './modular-channel.service';

@Controller()
export class ModularChannelController {
    constructor(
        private readonly modularChannelService: ModularChannelService,
    ) {
    }

    @On('voiceStateUpdate')
    onVoiceStateUpdate(previous: VoiceState, current: VoiceState): void {
        if (previous.channel)
            this.modularChannelService.updateOccupationChannel(previous.channel);

        if (current.channel)
            this.modularChannelService.updateOccupationChannel(current.channel);
    }

    @On('channelUpdate')
    onChannelUpdate(previous: VoiceChannel, channel: VoiceChannel): void {
        if (channel instanceof VoiceChannel) {
            this.modularChannelService.updateChannel(channel);
        }
    }

    @On('channelDelete')
    onChannelDelete(channel: Channel | PartialDMChannel): void {
        if (channel instanceof VoiceChannel)
            this.modularChannelService.deleteChannel(channel);
        else if (channel instanceof CategoryChannel)
            this.modularChannelService.deleteParent(channel);
    }
}
