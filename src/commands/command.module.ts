import {Module} from '@nestjs/common';
import {CommandController} from './foundation/command.controller';
import {CommandContainer} from './foundation/command.container';
import {CommandExplorer} from './foundation/command.explorer';
import {DiscoveryModule} from '@nestjs/core';
import {MetadataAccessor} from './foundation/helpers/metadata.accessor';
import {TheCatApiModule} from '../apis/thecatapi/thecatapi.module';
import {CatsController} from './cats.controller';
import {TypeOrmModule} from '@nestjs/typeorm';
import {GuildSettingsService} from './foundation/services/guild-settings.service';
import {CommandSettingsController} from './command-settings.controller';
import {DragonsController} from './dragons.controller';
import {HelpController} from './help.controller';
import {WhitelistedChannel} from './foundation/entities/whitelisted-channel.entity';
import {Dragons} from './dragons/dragons.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            WhitelistedChannel,
            Dragons,
        ]),
        DiscoveryModule,
        TheCatApiModule, // For the cats controller
    ],
    providers: [
        GuildSettingsService,
        CommandContainer,
        MetadataAccessor,
        CommandExplorer,
    ],
    controllers: [
        CommandController,
        CatsController,
        CommandSettingsController,
        DragonsController,
        HelpController,
    ],
})
export class CommandModule {
}
