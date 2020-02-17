import { injectable } from 'inversify';
import CommandRepository from './commandrepository';
import CommandLexer from './lexer';
import Request from './request';
import { Message } from 'discord.js';

/**
 * Executor for running commands on Discord messages
 */
@injectable()
export default class Executor {
    /**
     * The repository which holds all the commands
     */
    private readonly repository: CommandRepository;

    /**
     * Constructor for the Executor class
     *
     * @param {CommandRepository} repository the repository with all the commands
     */
    public constructor(repository: CommandRepository) {
        this.repository = repository;
    }

    /**
     * Tries to run a command if the message triggers one
     *
     * @param {string} command the message to be checked
     * @param {Message} message
     * @return {Promise<void>} promise which return nothing when the command has been executed
     */
    public async execute(command: string, message: Message): Promise<void> {
        const lexer = new CommandLexer(command);
        const name = lexer.next();

        if (this.repository.has(name)) {
            const request: Request = new Request(message, lexer.remaining());

            await this.repository.get(name).execute(request);
        }
    }
}
