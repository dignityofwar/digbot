import {Logger, Module} from '@nestjs/common';
import {DiscoveryModule} from '@nestjs/core';
import {CommandContainer} from './helpers/command.container';
import {MetadataAccessor} from './helpers/metadata.accessor';
import {CommandExplorer} from './services/command.explorer';
import {CommandController} from './command.controller';
import {DiscordModule} from '../../discord/discord.module';
import {SyncService} from './services/sync.service';

@Module({
    imports: [
        DiscoveryModule,
        DiscordModule,
    ],
    providers: [
        CommandContainer,
        MetadataAccessor,
        CommandExplorer,
        SyncService,
        CommandController,
        {
            provide: Logger,
            useFactory: () => new Logger('CommandCoreModule'),
        },
    ],
})
export class CommandCoreModule {
}
