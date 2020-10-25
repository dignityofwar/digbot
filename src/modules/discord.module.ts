import { DiscordModule as BaseDiscordModule } from '../discord/discord.module';
import { ConfigService } from '@nestjs/config';

export const DiscordModule = BaseDiscordModule.forRootAsync({
    useFactory: (config: ConfigService) => ({
        token: config.get('token'),
    }),
});
