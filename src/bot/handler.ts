import { Client } from 'discord.js';

/**
 * Abstract handler which can be used to create handlers for the bot
 */
export default abstract class Handler {
    public abstract up(client: Client): void;
};
