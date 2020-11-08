import { Command } from '../decorators/command.decorator';
import { Message } from 'discord.js';
import { Controller } from '@nestjs/common';

@Controller()
export class PingController {
    @Command('!ping')
    async ping(message: Message): Promise<void> {
        await message.reply('pong');
    }
}
