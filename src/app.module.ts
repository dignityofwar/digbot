import {Module} from '@nestjs/common';
import {DiscordModule} from './discord/discord.module';
import {TypeOrmModule} from '@nestjs/typeorm';
import {LogModule} from './log/log.module';
import {CommandModule} from './commands/command.module';
import {ModularChannelModule} from './modular-channels/modular-channel.module';
import {ReactionRolesModule} from './reaction-roles/reaction-roles.module';
import {MessengerModule} from './messenger/messenger.module';

@Module({
    imports: [
        TypeOrmModule.forRoot(),
        DiscordModule,
        LogModule,
        CommandModule,
        ModularChannelModule,
        ReactionRolesModule,
        MessengerModule,
    ],
})
export class AppModule {
}
