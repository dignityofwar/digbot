import { DiscordModule as BaseDiscordModule } from './foundation/discord.module';
import { ConfigService } from '@nestjs/config';
import { DiscordConfig } from './discord.config';
import { ConfigModule } from '../config/config.module';

export const DiscordModule = BaseDiscordModule.forRootAsync({
    imports: [ConfigModule, DiscordConfig],
    useFactory: (config: ConfigService) => config.get('discord'),
    inject: [ConfigService],
});
