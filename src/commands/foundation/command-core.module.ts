import {Logger, Module, OnApplicationBootstrap, OnModuleInit} from '@nestjs/common';
import {DiscoveryModule} from '@nestjs/core';
import {DiscordModule} from '../../discord/discord.module';
import {Command, CommandContainer} from './command.container';
import {MetadataAccessor} from './helpers/metadata.accessor';
import {CommandExplorer} from './command.explorer';
import {CommandController} from './command.controller';
import {ClusterClient} from 'detritus-client';
import {RequestTypes} from 'detritus-client-rest';
import CreateApplicationCommand = RequestTypes.CreateApplicationCommand

@Module({
    imports: [
        DiscoveryModule,
        DiscordModule,
    ],
    providers: [
        CommandContainer,
        MetadataAccessor,
        CommandExplorer,
    ],
    controllers: [
        CommandController,
    ],
})
export class CommandCoreModule implements OnModuleInit, OnApplicationBootstrap {
    private static readonly logger = new Logger('CommandModule');

    constructor(
        private discord: ClusterClient,
        private explorer: CommandExplorer,
        private commandContainer: CommandContainer,
    ) {
    }

    async onModuleInit(): Promise<void> {
        this.explorer.explore();
    }

    async onApplicationBootstrap() {
        try {
            await this.discord.rest.bulkOverwriteApplicationCommands(
                this.discord.applicationId,
                this.commandContainer.all()
                    .map(command => this.transformCommand(command)));

            CommandCoreModule.logger.log(`Synced commands`);
        } catch (err) {
            CommandCoreModule.logger.error(`Failed to sync commands to Discord: ${err}`, err.stack);
        }
    }

    private transformCommand(command: Command): CreateApplicationCommand {
        return {
            name: command.command,
            description: command.description,
        };
    }
}
