import { DiscordModule as BaseDiscordModule } from '../discord/discord.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

export const DiscordModule = BaseDiscordModule.forRootAsync({
    imports: [ConfigModule.forRoot()],
    useFactory: (config: ConfigService) => ({
        token: config.get('DISCORD_TOKEN'),
    }),
    inject: [ConfigService],
});
