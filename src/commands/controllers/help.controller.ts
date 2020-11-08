import { Controller } from '@nestjs/common';
import { Command } from '../decorators/command.decorator';
import { CommandContainer } from '../command.container';
import { Message, MessageEmbed } from 'discord.js';

@Controller()
export class HelpController {
    private helpMessage: MessageEmbed;

    constructor(
        repository: CommandContainer,
    ) {
        this.prepareHelpMessage(repository);
    }

    @Command({
        command: '!help',
        help: 'Show information about the commands',
    })
    async help(message: Message): Promise<void> {
        await message.channel.send(this.helpMessage);
    }

    private prepareHelpMessage(repository: CommandContainer): void {
        this.helpMessage = new MessageEmbed({
            title: '!help',
            description: 'beep',
        });
    }
}
