import {Injectable, Logger, OnApplicationBootstrap} from '@nestjs/common';
import {Command, CommandContainer} from '../helpers/command.container';
import {ClusterClient} from 'detritus-client';
import {CommandExplorer} from './command.explorer';
import {RequestTypes} from 'detritus-client-rest';

@Injectable()
export class SyncService implements OnApplicationBootstrap {
    constructor(
        private readonly logger: Logger,
        private discord: ClusterClient,
        private explorer: CommandExplorer,
        private commandContainer: CommandContainer,
    ) {
    }

    async onApplicationBootstrap(): Promise<void> {
        try {
            await this.discord.rest.bulkOverwriteApplicationCommands(
                this.discord.applicationId,
                this.commandContainer.all()
                    .map(command => this.transformCommand(command)));

            this.logger.log(`Synced commands`);
        } catch (err) {
            this.logger.error(`Failed to sync commands to Discord: ${err}`, err.stack);
        }
    }

    private transformCommand(command: Command): RequestTypes.CreateApplicationCommand {
        return {
            name: command.command,
            description: command.description,
        };
    }
}
