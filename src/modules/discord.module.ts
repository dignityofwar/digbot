import { DiscordModule as BaseDiscordModule } from '../discord/discord.module';
import { ConfigService } from '@nestjs/config';
import { DiscordConfig } from '../config/discord.config';
import { ConfigModule } from './config.module';

export const DiscordModule = BaseDiscordModule.forRootAsync({
    imports: [ConfigModule, DiscordConfig],
    useFactory: (config: ConfigService) => config.get('discord'),
    inject: [ConfigService],
});
