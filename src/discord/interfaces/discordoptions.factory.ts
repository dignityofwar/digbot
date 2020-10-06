import { DiscordModuleOptions } from './discordmodule.options';

export interface DiscordOptionsFactory {
    createDiscordOptions(): Promise<DiscordModuleOptions> | DiscordModuleOptions;
}
