import {Injectable, Logger} from '@nestjs/common';
import {DiscordEvent} from '../../discord/foundation/decorators/discord-event.decorator';
import {CommandContainer} from './helpers/command.container';
import {GatewayClientEvents, Structures} from 'detritus-client';
import InteractionDataApplicationCommand = Structures.InteractionDataApplicationCommand;

@Injectable()
export class CommandController {
    constructor(
        private readonly logger: Logger,
        private readonly repository: CommandContainer,
    ) {
    }

    @DiscordEvent('interactionCreate')
    async message({interaction}: GatewayClientEvents.InteractionCreate) {
        if (!interaction.isFromApplicationCommand) return;

        const command = this.repository.get((interaction.data as InteractionDataApplicationCommand).name);

        if (command) {
            try {
                await command.handler(interaction);
            } catch (err) {
                await interaction.createResponse({
                    type: 4,
                    data: {
                        content: 'I failed you',
                        flags: 1 << 6,
                    },
                });

                this.logger.warn(`Command "${command.command}" failed unexpectedly: ${err}`);
            }
        }
    }
}
