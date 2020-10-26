import { ConfigModule, registerAs } from '@nestjs/config';
import { DiscordModuleOptions } from '../discord/interfaces/discordmodule.options';

export const DiscordConfig = ConfigModule.forFeature(
    registerAs('discord', (): DiscordModuleOptions => ({
        token: process.env.DISCORD_TOKEN,
    })),
);
