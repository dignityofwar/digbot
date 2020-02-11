import { injectable } from 'inversify';
import CommandRepository from './commandrepository';
import CommandLexer from './lexer';
import Request from './request';
import Command from './command';
import { Message } from 'discord.js';

/**
 * Commander for running commands on Discord messages
 */
@injectable()
export default class Commander {
    /**
     * Lexer used to extract arguments from the message
     */
    private readonly lexer: CommandLexer;

    /**
     * The repository which holds all the commands
     */
    private readonly repository: CommandRepository;

    /**
     * Constructor for the Commander class
     *
     * @param {CommandLexer} lexer the lexer to extract arguments from a request
     * @param {CommandRepository} repository the repository with all the commands
     */
    public constructor(lexer: CommandLexer, repository: CommandRepository) {
        this.lexer = lexer;
        this.repository = repository;
    }

    /**
     * Tries to run a command if the message triggers one
     *
     * @param {Message} message the message to be checked
     * @return {Promise<void>} promise which return nothing when the command has been executed
     */
    public async execute(message: Message): Promise<void> {
        const argv: string[] = this.lexer.tokenize(message.cleanContent);

        if (this.repository.has(argv[0])) {
            const command: Command = this.repository.get(argv[0]);
            const request: Request = new Request(command, message, argv);

            await command.execute(request);
        }
    }
}
