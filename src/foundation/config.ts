import { injectable } from 'inversify';

/**
 * Holds the main configuration of the application
 */
@injectable()
export default class Config {
    /**
     * The Discord token used to connect to Discord
     */
    public readonly discordToken: string = process.env.DISCORD_TOKEN || '';
}
