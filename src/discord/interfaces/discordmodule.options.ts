import {ClientOptions} from 'discord.js';

export interface DiscordModuleOptions extends ClientOptions {
    token: string;
}
