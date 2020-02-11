import { injectable, multiInject } from 'inversify';
import { Client } from 'discord.js';
import Handler from './handler';
import { discordEvent } from './events';
import Config from '../foundation/config';

/**
 * The Bot which will have all the logic to handle incoming events from Discord
 */
@injectable()
export default class Bot {
    /**
     * The Discord client the bot will listen on
     */
    private readonly client: Client = new Client();

    /**
     * The configuration
     */
    private readonly config: Config;

    /**
     * An array of handlers that are used to handle incoming events
     */
    private readonly handlers: Set<Handler> = new Set<Handler>();

    /**
     * Constructor for the Bot
     *
     * @param config
     * @param handlers
     */
    public constructor(config: Config, @multiInject(Handler) handlers: Handler[]) {
        this.config = config;

        handlers.forEach((handler: Handler) => this.registerHandler(handler));
    }

    /**
     * Starts the bot
     */
    public async start(): Promise<void> {
        await this.client.login(this.config.discordToken);
    }

    /**
     * Stops the bot
     */
    public async stop(): Promise<void> {
        await this.client.destroy();
    }

    /**
     * Register a handler
     *
     * @param handler
     */
    public registerHandler(handler: Handler): void {
        if (this.handlers.has(handler)) return;

        this.handlers.add(handler);
        handler.listeners.forEach((listener: Function, event: string) => this.client.on(event, listener));
    }

    /**
     * Remove a handler
     *
     * @param handler
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
