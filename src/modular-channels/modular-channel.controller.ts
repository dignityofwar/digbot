import {Controller} from '@nestjs/common';
import {CategoryChannel, Channel, PartialDMChannel, VoiceChannel, VoiceState} from 'discord.js';
import {On} from '../discord/decorators/on.decorator';
import {MCSEventsService} from './services/mcs-events.service';

@Controller()
export class ModularChannelController {
    constructor(
        private readonly eventsService: MCSEventsService,
    ) {
    }

    @On('voiceStateUpdate')
    onVoiceStateUpdate(previous: VoiceState, current: VoiceState): void {
        if (previous.channel)
            this.eventsService.updateOccupationChannel(previous.channel);

        if (current.channel)
            this.eventsService.updateOccupationChannel(current.channel);
    }

    @On('channelUpdate')
    onChannelUpdate(previous: VoiceChannel, channel: VoiceChannel): void {
        if (channel instanceof VoiceChannel) {
            this.eventsService.updateChannel(channel);
        }
    }

    @On('channelDelete')
    onChannelDelete(channel: Channel | PartialDMChannel): void {
        if (channel instanceof VoiceChannel)
            this.eventsService.deleteChannel(channel);
        else if (channel instanceof CategoryChannel)
            this.eventsService.deleteParent(channel);
    }
}
