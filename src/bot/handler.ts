import { discordEvent } from './events';

export default abstract class Handler {
    /**
     * A map that maps events names to a method that handles it
     */
    public abstract readonly listeners: Map<string, discordEvent>;
};
