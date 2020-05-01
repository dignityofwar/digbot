import { injectable } from 'inversify';
import { Logger } from 'winston';
import { getLogger } from '../../logger';
import Handler from '../../bot/handler';
import { Client, Message } from 'discord.js';
import Executor from './executor';

/**
 * Handles incoming commands
 */
@injectable()
export default class CommandHandler extends Handler {
    private static readonly logger: Logger = getLogger('command-handler');

    /**
     * Constructor for the CommandHandler
     *
     * @param {Executor} executor the executor that is used to run commands
     */
    public constructor(private readonly executor: Executor) {
        super();
    }

    /**
     * @param {Client} client
     */
    public up(client: Client): void {
        client.on('message', this.onMessage.bind(this));
    }

    /**
     * Tries to run a command whenever a user sends one
     *
     * @param {Message} message the message the user send
     */
    public onMessage(message: Message): void {
        this.executor.execute(message)
            .catch((e: Error) => CommandHandler.logger.error(e.stack ?? e.message));
    }
}
