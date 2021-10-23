import {Env} from './foundation/decorators/env-var.decorator';
import {IsNotEmpty, IsString} from 'class-validator';
import {config} from './foundation/config';

class DiscordConfig {
    @Env('DISCORD_TOKEN')
    @IsString()
    @IsNotEmpty()
    token: string;
}

export const discordConfig = config(DiscordConfig);
