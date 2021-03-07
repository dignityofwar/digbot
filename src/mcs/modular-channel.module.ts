import {Module} from '@nestjs/common';
import {ModularChannelController} from './modular-channel.controller';
import {TypeOrmModule} from '@nestjs/typeorm';
import {Channel} from './entities/channel.entity';
import {Group} from './entities/group.entity';
import {ModularChannelService} from './modular-channel.service';
import {ModularChannelContainer} from './modular-channel.container';
import {GroupService} from './services/group.service';
import {ChannelAllocationService} from './services/channel-allocation.service';
import {ChannelNamingService} from './services/channel-naming.service';
import {ChannelOrderService} from './services/channel-order.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Channel,
            Group,
        ]),
    ],
    providers: [
        GroupService,
        ChannelAllocationService,
        ChannelNamingService,
        ChannelOrderService,
        ModularChannelContainer,
        ModularChannelService,
    ],
    controllers: [ModularChannelController],
})
export class ModularChannelModule {
}
