import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {RoleMessenger} from './entities/role-messenger.entity';
import {JoinMessenger} from './entities/join-messenger.entity';
import {MessengerController} from './messenger.controller';
import {DiscordModule} from '../discord/discord.module';
import {JoinSettingsController} from './controllers/join-settings.controller';
import {RoleSettingsController} from './controllers/role-settings.controller';
import {LogService} from '../log/log.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            RoleMessenger,
            JoinMessenger,
        ]),
        DiscordModule,
        LogService,
    ],
    controllers: [
        MessengerController,
        RoleSettingsController,
        JoinSettingsController,
    ],
})
export class MessengerModule {
}
