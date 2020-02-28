import DiscordContract from './contracts/discordcontract';

export default class Discord implements DiscordContract {
    /**
     * @type {string} The Discord token used to connect to Discord
     */
    public readonly token: string = process.env.DISCORD_TOKEN ?? '';
}
