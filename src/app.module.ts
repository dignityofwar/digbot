import { Module } from '@nestjs/common';
import { CommandModule } from './commands/command.module';
import { DiscordModule } from './discord/discord.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [
        ConfigModule.forRoot(),
        TypeOrmModule.forRoot(),
        DiscordModule,
        CommandModule,
    ],
})
export class AppModule {
}
