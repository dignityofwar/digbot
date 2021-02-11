import {Controller} from '@nestjs/common';
import {CategoryChannel, Channel, PartialDMChannel, VoiceChannel, VoiceState} from 'discord.js';
import {On} from '../discord/foundation/decorators/on.decorator';
import {ModularChannelService} from './modular-channel.service';
import {empty} from '../utils/filter.utils';

@Controller()
export class ModularChannelController {
    constructor(
        private readonly modularChannelService: ModularChannelService,
    ) {
    }

    @On('voiceStateUpdate')
    onVoiceStateUpdate(...states: VoiceState[]): void {
        this.modularChannelService.notifyChange(
            states
                .map(({channel}) => channel)
                .filter(empty),
        );
    }

    @On('channelUpdate')
    onChannelUpdate(previous: VoiceChannel, channel: VoiceChannel): void {
        if (channel instanceof VoiceChannel) {
            if (previous.parentID === channel.parentID && previous.rawPosition !== channel.rawPosition)
                this.modularChannelService.channelMoved(channel);
        }
    }

    @On('channelDelete')
    onChannelDelete(channel: Channel | PartialDMChannel): void {
        if (channel instanceof VoiceChannel)
            this.modularChannelService.channelDeleted(channel);
        else if (channel instanceof CategoryChannel)
            this.modularChannelService.parentDeleted(channel);
    }
}
