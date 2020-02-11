import { injectable } from 'inversify';
import CommandRepository from './commandrepository';
import CommandLexer from './lexer';
import Request from './request';
import Command from './command';
import { Message } from 'discord.js';

@injectable()
export default class Commander {
    private readonly lexer: CommandLexer;

    private readonly repository: CommandRepository;

    public constructor(lexer: CommandLexer, repository: CommandRepository) {
        this.lexer = lexer;
        this.repository = repository;
    }

    public async execute(message: Message): Promise<void> {
        const argv: string[] = this.lexer.tokenize(message.cleanContent);

        if (this.repository.has(argv[0])) {
            const command: Command = this.repository.get(argv[0]);
            const request: Request = new Request(command, message, argv);

            await command.execute(request);
        }
    }
}
