import { injectable } from 'inversify';
import CommandLexer from './lexer';
import Request from './request';
import { Message } from 'discord.js';
import Action from './action';

/**
 * Executor for running commands on Discord messages
 */
@injectable()
export default class Executor {
    /**
     * Constructor for the Executor class
     *
     * @param {Map} repository the repository with all the commands
     */
    public constructor(private readonly repository: Map<string, Action>) {
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

            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            await this.repository.get(name)!.execute(request);
        }
    }
}
