import { inject, injectable, multiInject } from 'inversify';
import Handler from './handler';
import { discordEvent } from './events';
import Runnable from '../foundation/runnable';
import { Client } from 'discord.js';

/**
 * The Bot which will have all the logic to handle incoming events from Discord
 */
@injectable()
export default class Bot implements Runnable {
    /**
     * An array of handlers that are used to handle incoming events
     */
    private readonly handlers: Set<Handler> = new Set<Handler>();

    /**
     * Constructor for the Bot
     *
     * @param {string} token The configuration the bot should use
     * @param {Client} client
     * @param {Handler[]} handlers The handlers that will be registered
     */
    public constructor(
        @inject('discordToken') private readonly token: string,
        private readonly client: Client,
        @multiInject(Handler) handlers?: Handler[],
    ) {
        handlers?.forEach((handler: Handler) => handler.up(this.client));
    }

    /**
     * Starts the bot
     *
     * @return {Promise<void>}
     */
    public async start(): Promise<void> {
        await this.client.login(this.token);
    }

    /**
     * Stops the bot
     *
     * @return {Promise<void>}
     */
    public async terminate(): Promise<void> {
        await this.client.destroy();
    }
}
