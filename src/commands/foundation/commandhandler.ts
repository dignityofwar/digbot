import Handler from '../../bot/handler';
import { discordEvent } from '../../bot/events';
import { Message } from 'discord.js';
import { injectable } from 'inversify';
import { Logger } from 'winston';
import { childLogger } from '../../logger/logger';
import Commander from './commander';

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
     *
     */
    private readonly commander: Commander;

    /**
     * Constructor for the CommandHandler
     *
     * @param commander
     */
    public constructor(commander: Commander) {
        super();

        this.commander = commander;
    }

    /**
     * Runs a command whenever a user sends one
     *
     * @param message the message the user send
     */
    public onMessage(message: Message): void {
        this.commander.execute(message)
            .catch((e: Error) => CommandHandler.logger.error(e.stack || e.message));
    }
}
