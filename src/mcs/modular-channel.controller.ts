import { Controller } from '@nestjs/common';
import { VoiceState } from 'discord.js';
import { On } from '../discord/foundation/decorators/on.decorator';
import { ModularChannelService } from './modular-channel.service';

@Controller()
export class ModularChannelController {
    constructor(
        private readonly modularChannelService: ModularChannelService,
    ) {}

    @On('voiceStateUpdate')
    async onVoiceStateUpdate(old: VoiceState, state: VoiceState): Promise<void> {
        // if (old.channel) await this.modularChannelService.initChannel(old.channel);
        // if (state.channel) await this.modularChannelService.initChannel(state.channel);

        if (old.channelID !== state.channelID) {
            if (old.channel && old.channel.members.size === 0) {
                // Last member left the channel
                await this.modularChannelService.tidy(old.channel);
            }

            if (state.channel) {
                // Channel join
                // console.log(`${state.member.displayName} joined ${state.channel.name}`);
            }
        }
    }
}
