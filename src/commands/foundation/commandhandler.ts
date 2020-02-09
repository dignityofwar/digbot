import Handler from '../../bot/handler';
import { discordEvent } from '../../bot/events';
import { Message } from 'discord.js';
import { injectable } from 'inversify';
import { Logger } from 'winston';
import { childLogger } from '../../logger/logger';
import CatsCommand from '../catscommand';
import Request from './request';

/**
 * Handles incoming commands
 */
@injectable()
export default class CommandHandler extends Handler {
    private static logger: Logger = childLogger('command-handler');

    /**
     * A map that maps events names to a method that handles it
     */
    public readonly listeners: Map<string, discordEvent> = new Map<string, discordEvent>([
        ['message', this.onMessage.bind(this)],
    ]);

    /**
     * The prefix that is used before a command
     */
    private readonly prefix: string = '!';

    /**
     *
     */
    private readonly catsCommand: CatsCommand;

    /**
     * Constructor for the CommandHandler
     *
     * @param catsCommand
     */
    constructor(catsCommand: CatsCommand) {
        super();

        this.catsCommand = catsCommand;
    }

    /**
     * Runs a command whenever a user sends one
     *
     * @param message the message the user send
     */
    public onMessage(message: Message): void {
        if (message.cleanContent.startsWith(this.prefix)) {
            if (message.cleanContent.startsWith(this.catsCommand.name, this.prefix.length)) {
                const request: Request = new Request(this.catsCommand, message);

                this.catsCommand.execute(request).catch((e: Error) => CommandHandler.logger.error(e.stack || e.message));
            }
        }
    }
}
