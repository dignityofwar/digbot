import {Logger, Module, OnModuleInit} from '@nestjs/common';
import {DiscoveryModule} from '@nestjs/core';
import {DiscordModule} from '../../discord/discord.module';
import {Command, CommandContainer} from './command.container';
import {MetadataAccessor} from './helpers/metadata.accessor';
import {CommandExplorer} from './command.explorer';
import {CommandController} from './command.controller';
import {Routes} from 'discord-api-types/v9';
import {REST} from '@discordjs/rest';
import {discordConfig} from '../../config/discord.config';

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
export class CommandCoreModule implements OnModuleInit {
    private static readonly logger = new Logger('CommandModule');

    constructor(
        private rest: REST,
        private explorer: CommandExplorer,
        private commandContainer: CommandContainer,
    ) {
    }

    async onModuleInit(): Promise<void> {
        this.explorer.explore();

        try {
            await this.rest.put(
                Routes.applicationCommands(discordConfig.clientId),
                {
                    body: this.commandContainer.all()
                        .map(command => this.transformCommand(command)),
                },
            );
        } catch (err) {
            CommandCoreModule.logger.error(`Failed to sync commands to Discord: ${err}`, err.stack);
        }
    }

    private transformCommand(command: Command) {
        return {
            name: command.command,
            description: command.description,
        };
    }
}
