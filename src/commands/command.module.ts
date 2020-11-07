import { Module } from '@nestjs/common';
import { CommandController } from './command.controller';
import { DiscordModule } from '../modules/discord.module';
import { CommandContainer } from './command.container';

@Module({
    imports: [DiscordModule],
    providers: [CommandContainer],
    controllers: [CommandController],
})
export class CommandModule {
}
