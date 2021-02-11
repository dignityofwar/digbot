import {Controller} from '@nestjs/common';
import {Message} from 'discord.js';
import {On} from '../discord/foundation/decorators/on.decorator';
import {CommandContainer} from './command.container';
import {ArgumentLexer} from './helpers/argument.lexer';

@Controller()
export class CommandController {
    constructor(
        private readonly repository: CommandContainer,
    ) {
    }

    @On('message')
    message(message: Message): void {
        if (message.author.bot || message.channel.type !== 'text') return;

        const lexer = new ArgumentLexer(message.cleanContent);
        const commandName = lexer.next();
        const command = this.repository.get(commandName);

        if (command) {
            void command.handler(message, lexer.all());
        }
    }
}
