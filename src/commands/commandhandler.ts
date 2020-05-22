import { injectable } from 'inversify';
import { getLogger } from '../logger';
import Handler from '../bot/handler';
import { Client, Message } from 'discord.js';
import Executor from './executor';
import { catchAndLogAsync } from '../utils/logger';

/**
 * Handles incoming commands
 */
@injectable()
export default class CommandHandler extends Handler {
    private static readonly logger = getLogger('command-handler');

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
    @catchAndLogAsync(CommandHandler.logger)
    public async onMessage(message: Message): Promise<void> {
        if (message.author.bot || message.channel.type !== 'text') return;

        await this.executor.execute(message);
    }
}
