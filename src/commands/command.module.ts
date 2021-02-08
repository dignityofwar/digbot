import { Module } from '@nestjs/common';
import { CommandController } from './command.controller';
import { CommandContainer } from './command.container';
import { PingController } from './controllers/ping.controller';
import { CommandExplorer } from './command.explorer';
import { DiscoveryModule } from '@nestjs/core';
import { MetadataAccessor } from './helpers/metadata.accessor';
import { TheCatApiModule } from '../apis/thecatapi/thecatapi.module';
import { CatsController } from './controllers/cats.controller';
import {DiscordModule} from '../discord/discord.module';

@Module({
    imports: [
        DiscoveryModule,
        DiscordModule,
        TheCatApiModule, // For the cats controller
    ],
    providers: [
        CommandContainer,
        MetadataAccessor,
        CommandExplorer,
    ],
    controllers: [
        CommandController,
        PingController,
        CatsController,
    ],
})
export class CommandModule {
}
