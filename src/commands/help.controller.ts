import {Controller} from '@nestjs/common';
import {Command} from './foundation/decorators/command.decorator';
import {CommandContainer} from './foundation/command.container';
import {MessageEmbed} from 'discord.js';
import {CommandRequest} from './foundation/command.request';

@Controller()
export class HelpController {
    constructor(
        private readonly repository: CommandContainer,
    ) {
    }

    @Command({
        command: '!help',
        description: 'Show information about the controllers',
    })
    async help({channel}: CommandRequest): Promise<void> {
        const embed = new MessageEmbed();

        this.repository.all()
            .filter(({command, adminOnly}) => !command.startsWith('!help') && !adminOnly)
            .forEach(({command, description, adminOnly}) => {
                embed.addField(`${command}`, description);
            });

        await channel.send(embed);
    }

    @Command({
        adminOnly: true,
        command: '!help:admin',
        description: 'Show information about the admin controllers',
    })
    async admin({channel}: CommandRequest): Promise<void> {
        const embed = new MessageEmbed();

        this.repository.all()
            .filter(({command, adminOnly}) => !command.startsWith('!help') && adminOnly)
            .forEach(({command, description, adminOnly}) => {
                embed.addField(`${command}`, description);
            });

        await channel.send(embed);
    }
}
