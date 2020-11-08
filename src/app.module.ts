import { Module } from '@nestjs/common';
import { CommandModule } from './commands/command.module';
import { DiscordModule } from './modules/discord.module';

@Module({
    imports: [
        DiscordModule,
        CommandModule,
    ],
})
export class AppModule {
}
