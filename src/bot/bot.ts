import { inject, injectable, multiInject } from 'inversify';
import Handler from './handler';
import { discordEvent } from './events';
import Runnable from '../foundation/runnable';
import { Client } from 'discord.js';
import ConfigContract, { CONFIGCONTRACT } from '../config/contracts/configcontract';

/**
 * The Bot which will have all the logic to handle incoming events from Discord
 */
@injectable()
export default class Bot implements Runnable {
    /**
     * The Discord client the bot will listen on
     */
    private readonly client: Client;

    /**
     * The configuration
     */
    private readonly config: ConfigContract;

    /**
     * An array of handlers that are used to handle incoming events
     */
    private readonly handlers: Set<Handler> = new Set<Handler>();

    /**
     * Constructor for the Bot
     *
     * @param {ConfigContract} config The configuration the bot should use
     * @param {Client} client
     * @param {Handler[]} handlers The handlers that will be registered
     */
    public constructor(@inject(CONFIGCONTRACT) config: ConfigContract, client: Client, @multiInject(Handler) handlers: Handler[]) {
        this.config = config;
        this.client = client;

        handlers.forEach((handler: Handler) => this.registerHandler(handler));
    }

    /**
     * Starts the bot
     *
     * @return {Promise<void>}
     */
    public async start(): Promise<void> {
        await this.client.login(this.config.discord.token);
    }

    /**
     * Stops the bot
     *
     * @return {Promise<void>}
     */
    public async terminate(): Promise<void> {
        await this.client.destroy();
    }

    /**
     * Register a handler
     *
     * @param handler
     * @return {void}
     */
    public registerHandler(handler: Handler): void {
        if (this.handlers.has(handler)) return;

        this.handlers.add(handler);
        handler.listeners.forEach((listener: Function, event: string) => this.client.on(event, listener.bind(handler)));
    }

    /**
     * Remove a handler
     *
     * @param handler
     * @return {boolean}
     */
    public removeHandler(handler: Handler): boolean {
        if (this.handlers.has(handler)) {
            this.handlers.delete(handler);
            handler.listeners.forEach((listener: discordEvent, event: string) => this.client.removeListener(event, listener));

            return true;
        }
        return false;
    }
}
