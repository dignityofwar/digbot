import { injectable } from 'inversify';

/**
 * Holds the main configuration of the application
 */
@injectable()
export default class Config {
    /**
     * Set to true when developing the application, this will provide more information for debugging
     */
    public readonly debug: boolean = process.env.DEBUG ? /^true$/i.test(process.env.DEBUG.trim()) : false;

    /**
     * The Discord token used to connect to Discord
     */
    public readonly discordToken: string = process.env.DISCORD_TOKEN || '';
}
