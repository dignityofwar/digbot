import { Module } from '@nestjs/common';
import { DiscordModule } from './modules/discord.module';
import { CommandModule } from './commands/command.module';

@Module({
    imports: [
        DiscordModule,
        CommandModule,
    ],
})
export class AppModule {
}
