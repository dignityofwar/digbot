export default class Discord {
    /**
     * @type {string} The Discord token used to connect to Discord
     */
    public readonly token: string = process.env.DISCORD_TOKEN ?? '';
}

export const discordConfig = new Discord();
