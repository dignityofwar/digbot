import { injectable, multiInject } from 'inversify';
import { Client, Guild, RateLimitInfo } from 'discord.js';
import Handler from './handler';
import { discordEvent } from './events';
import Index from '../config';
import { childLogger } from '../logger/logger';

/**
 * The Bot which will have all the logic to handle incoming events from Discord
 */
@injectable()
export default class Bot {
    /**
     * The Discord client the bot will listen on
     */
    private readonly client: Client = new Client({
        disabledEvents: ['TYPING_START'],
    });

    /**
     * The configuration
     */
    private readonly config: Index;

    /**
     * An array of handlers that are used to handle incoming events
     */
    private readonly handlers: Set<Handler> = new Set<Handler>();

    /**
     * Constructor for the Bot
     *
     * @param {Index} config The configuration the bot should use
     * @param {Handler[]} handlers The handlers that will be registered
     */
    public constructor(config: Index, @multiInject(Handler) handlers: Handler[]) {
        this.config = config;

        this.setupClientLogging();
        handlers.forEach((handler: Handler) => this.registerHandler(handler));
    }

    /**
     * Setup listeners on the client for logging purposes
     */
    private setupClientLogging(): void {
        const logger = childLogger('discord-client');

        // clientUserGuildSettingsUpdate
        // clientUserSettingsUpdate
        this.client.on('debug', (info: string) => logger.silly(info));
        this.client.on('disconnect', (event: CloseEvent) => logger.info(`Client disconnected: ${event.reason}(${event.code})`));
        this.client.on('error', (error: Error) => logger.error(error.message));
        this.client.on('guildUnavailable', (guild: Guild) => logger.info(`Guild became unavailable: ${guild.name}(${guild.id})`));
        this.client.on('rateLimit', (info: RateLimitInfo) => logger.debug(`Rate limit reached: ${JSON.stringify(info)}`));
        this.client.on('ready', () => logger.info('Client ready'));
        this.client.on('reconnecting', () => logger.debug('Client reconnecting'));
        this.client.on('resume', (replayed: number) => logger.info(`Client resumed: ${replayed}`));
        this.client.on('warn', (warning: string) => logger.warn(warning));
    }

    /**
     * Starts the bot
     *
     * @return {Promise<void>}
     */
    public async start(): Promise<void> {
        await this.client.login(this.config.app.discordToken);
    }

    /**
     * Stops the bot
     *
     * @return {Promise<void>}
     */
    public async stop(): Promise<void> {
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
        handler.listeners.forEach((listener: Function, event: string) => this.client.on(event, listener));
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
