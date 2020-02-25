export default interface DiscordContract {
    readonly token: string;
}

export const DISCORDCONTRACT = Symbol.for('config.contracts.DiscordContract');
