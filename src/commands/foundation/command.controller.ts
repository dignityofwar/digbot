import {Controller, Logger} from '@nestjs/common';
import {On} from '../../discord/decorators/on.decorator';
import {CommandContainer} from './command.container';
import {GatewayClientEvents, Structures} from 'detritus-client';
import InteractionDataApplicationCommand = Structures.InteractionDataApplicationCommand;
import InteractionCreate = GatewayClientEvents.InteractionCreate;

@Controller()
export class CommandController {
    private static readonly logger = new Logger('CommandController');

    constructor(
        private readonly repository: CommandContainer,
    ) {
    }

    @On('interactionCreate')
    async message({interaction}: InteractionCreate) {
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

                CommandController.logger.warn(`Command "${command.command}" failed unexpectedly: ${err}`);
            }
        }
    }
}
