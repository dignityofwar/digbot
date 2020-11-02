import { Controller, Logger } from '@nestjs/common';
import { Message } from 'discord.js';
import { On } from '../discord/decorators/on.decorator';
import { CommandRepository } from './command.repository';
import { ArgumentLexer } from './utils/argument.lexer';

@Controller()
export class CommandController {
    private static readonly logger = new Logger('CommandController');

    constructor(
        private readonly repository: CommandRepository,
    ) {}

    @On('message')
    async message(message: Message): Promise<void> {
        if (message.author.bot || message.channel.type !== 'text') return;

        const lexer = new ArgumentLexer(message.cleanContent);
        const commandName = lexer.next();
        const command = this.repository.get(commandName);

        if (command) {
            try {
                await command(message, lexer.all());
            } catch (e) {
                CommandController.logger.error(
                    `Command ${commandName} failed unexpectedly.`,
                    e.stack,
                    JSON.stringify(message),
                );
            }
        }
    }
}
