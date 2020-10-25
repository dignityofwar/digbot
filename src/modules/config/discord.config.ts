import { ConfigModule } from '@nestjs/config';

export const DiscordConfig = ConfigModule.forFeature(() => ({
    token: process.env.DISCORD_TOKEN,
}));
