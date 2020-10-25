import { DiscordClient } from '../discord.client';

export interface DiscordResolver {
    resolve(instance: Record<string, any>, methodName: string, discordClient: DiscordClient): void;
}
