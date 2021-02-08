import {Controller} from '@nestjs/common';
import {VoiceState} from 'discord.js';
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
                .filter(empty)
        );
    }
}
