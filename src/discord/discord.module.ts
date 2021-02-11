import {DiscordModule as BaseDiscordModule} from './foundation/discord.module';
import {ConfigService} from '@nestjs/config';
import {DiscordConfig} from './discord.config';

export const DiscordModule = BaseDiscordModule.forRootAsync({
    imports: [DiscordConfig],
    useFactory: (config: ConfigService) => config.get('discord'),
    inject: [ConfigService],
});
