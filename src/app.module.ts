import {Module} from '@nestjs/common';
import { CommandModule } from './commands/command.module';
import { DiscordModule } from './discord/discord.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ModularChannelModule } from './mcs/modular-channel.module';

@Module({
    imports: [
        ConfigModule.forRoot(),
        TypeOrmModule.forRoot(),
        DiscordModule,
        CommandModule,
        ModularChannelModule,
    ],
})
export class AppModule {
}
