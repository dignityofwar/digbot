import { Module } from '@nestjs/common';
import { DiscordModule } from './modules/discord.module';
import { ConfigModule } from './modules/config.module';
import { CommandModule } from './commands/command.module';

@Module({
    imports: [
        ConfigModule,
        DiscordModule,
        CommandModule,
    ],
})
export class AppModule {
}
