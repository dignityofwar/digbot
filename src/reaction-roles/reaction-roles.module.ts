import {Module} from '@nestjs/common';
import {ReactionRolesController} from './reaction-roles.controller';
import {TypeOrmModule} from '@nestjs/typeorm';
import {ReactionRole} from './entities/reaction-role.entity';
import {DiscordModule} from '../discord/discord.module';
import {ReactionRolesSettingsController} from './commands/reaction-roles-settings.controller';
import {LogModule} from '../log/log.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            ReactionRole,
        ]),
        DiscordModule,
        LogModule,
    ],
    controllers: [
        ReactionRolesController,
        ReactionRolesSettingsController,
    ],
})
export class ReactionRolesModule {
}
