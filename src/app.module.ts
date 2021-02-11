import {Module} from '@nestjs/common';
import {CommandModule} from './commands/command.module';
import {DiscordModule} from './discord/discord.module';
import {ConfigModule} from '@nestjs/config';
import {TypeOrmModule} from '@nestjs/typeorm';
import {ModularChannelModule} from './mcs/modular-channel.module';
import {LogModule} from './log/log.module';

@Module({
    imports: [
        ConfigModule.forRoot(),
        TypeOrmModule.forRoot(),
        DiscordModule,
        LogModule,
        CommandModule,
        ModularChannelModule,
    ],
})
export class AppModule {
}
