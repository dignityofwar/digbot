import { DiscordModule as BaseDiscordModule } from '../discord/discord.module';
import { ConfigService } from '@nestjs/config';
import { DiscordConfig } from '../config/discord.config';

export const DiscordModule = BaseDiscordModule.forRootAsync({
    imports: [DiscordConfig],
    useFactory: (config: ConfigService) => config.get('discord'),
    inject: [ConfigService],
});
