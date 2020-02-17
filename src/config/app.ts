export default class App {
    /**
     * @type {boolean} Set to true when developing the application, this will provide more information for debugging
     */
    public readonly debug: boolean = process.env.DEBUG ? /^true$/i.test(process.env.DEBUG.trim()) : false;

    /**
     * @type {string} The Discord token used to connect to Discord
     */
    public readonly discordToken: string = process.env.DISCORD_TOKEN || '';
}
