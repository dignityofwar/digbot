import {Module} from '@nestjs/common';
import {ModularChannelController} from './modular-channel.controller';
import {TypeOrmModule} from '@nestjs/typeorm';
import {Channel} from './entities/channel.entity';
import {Group} from './entities/group.entity';
import {DiscordModule} from '../discord/discord.module';
import {ModularChannelService} from './modular-channel.service';
import {ModularChannelContainer} from './modular-channel.container';
import {GroupService} from './services/group.service';
import {SyncService} from './services/sync.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Channel,
            Group,
        ]),
        DiscordModule,
    ],
    providers: [
        GroupService,
        ModularChannelContainer,
        ModularChannelService,
        SyncService
    ],
    controllers: [ModularChannelController],
})
export class ModularChannelModule {
}
