import { Module } from '@nestjs/common';
import { CommandController } from './command.controller';
import { DiscordModule } from '../modules/discord.module';

@Module({
    imports: [DiscordModule],
    providers: [],
    controllers: [CommandController],
})
export class CommandModule {
}
