import {Command} from '../decorators/command.decorator';
import {ChannelManager, Message} from 'discord.js';
import {Controller} from '@nestjs/common';
import {DiscordClient} from '../../discord/foundation/discord.client';

@Controller()
export class PingController {
    private readonly channelManager: ChannelManager;

    constructor(discordClient: DiscordClient) {
        this.channelManager = discordClient.channels;
    }

    @Command('!ping')
    async ping(message: Message): Promise<void> {
        try {
            await this.channelManager.fetch('123123123123', false, true);
        } catch (e) {
            await message.channel.send(e.message);
        }

        // await message.reply('pong');
    }
}
