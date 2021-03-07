import {Controller} from '@nestjs/common';
import {Command} from './foundation/decorators/command.decorator';
import {CommandContainer} from './foundation/command.container';
import {MessageEmbed} from 'discord.js';
import {CommandRequest} from './foundation/command.request';

@Controller()
export class HelpController {
    private defaultHelp: MessageEmbed;

    private adminHelp: MessageEmbed;

    constructor(
        repository: CommandContainer,
    ) {
        this.prepareMessages(repository);
    }

    @Command({
        command: '!help',
        description: 'Show information about the commands',
    })
    async help({channel}: CommandRequest): Promise<void> {
        await channel.send(this.defaultHelp);
    }

    @Command({
        adminOnly: true,
        command: '!help:admin',
        description: 'Show information about the admin commands',
    })
    async admin({channel}: CommandRequest): Promise<void> {
        await channel.send(this.adminHelp);
    }

    private prepareMessages(repository: CommandContainer): void {
        const commands = repository.all()
            .sort((a, b) => a.command.localeCompare(b.command));

        this.defaultHelp = new MessageEmbed();
        this.adminHelp = new MessageEmbed();

        commands.filter(({command}) => command.startsWith('!help'))
            .forEach(({command, description, adminOnly}) => {
                if (adminOnly)
                    this.adminHelp.addField(`\`${command}\``, description);
                else
                    this.defaultHelp.addField(`\`${command}\``, description);
            });
    }
}
