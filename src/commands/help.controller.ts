import {Controller} from '@nestjs/common';
import {Command} from './foundation/decorators/command.decorator';
import {CommandContainer} from './foundation/command.container';
import {MessageEmbed} from 'discord.js';

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
    async help() {
        return new MessageEmbed({
            fields: this.repository.all()
                .filter(({command, adminOnly}) => !command.startsWith('!help') && !adminOnly)
                .map(({command, description}) => ({
                    name: command,
                    value: description,
                })),
        });
    }

    @Command({
        adminOnly: true,
        command: '!help:admin',
        description: 'Show information about the admin controllers',
    })
    async admin() {
        return new MessageEmbed({
            fields: this.repository.all()
                .filter(({command, adminOnly}) => !command.startsWith('!help') && adminOnly)
                .map(({command, description}) => ({
                    name: command,
                    value: description,
                })),
        });
    }
}
