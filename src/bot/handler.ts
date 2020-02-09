import { discordEvent } from './events';

/**
 * Abstract handler which can be used to create handlers for the bot
 */
export default abstract class Handler {
    /**
     * A map that maps events names to a method that handles it
     */
    public abstract readonly listeners: Map<string, discordEvent>;
};
