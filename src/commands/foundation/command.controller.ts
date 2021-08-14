import {Controller, Logger} from '@nestjs/common';
import {CommandInteraction, GuildMember, Interaction, MessageEmbed} from 'discord.js';
import {On} from '../../discord/decorators/on.decorator';
import {CommandContainer} from './command.container';
import {CommandException} from './exceptions/command.exception';

@Controller()
export class CommandController {
    private static readonly logger = new Logger('CommandController');

    constructor(
        private readonly repository: CommandContainer,
    ) {
    }

    @On('interactionCreate')
    async message(interaction: Interaction) {
        if (!interaction.isCommand() || !(interaction.member instanceof GuildMember)) return;

        const command = this.repository.get(interaction.commandName);

        if (command) {
            try {
                const response = await command.handler(interaction as CommandInteraction);

                if (typeof response == 'string')
                    await interaction.reply(response);
                else if (response instanceof MessageEmbed)
                    await interaction.reply({
                        embeds: [response],
                    });
                else if (response)
                    CommandController.logger.warn(`Command "${command.command}" returned unexpected object of type "${typeof response}"`);
            } catch (err) {
                await interaction.reply(
                    err instanceof CommandException
                        ? err.response instanceof MessageEmbed ? {embeds: [err.response]} : err.response
                        : {embeds: [new MessageEmbed().setColor('RED').setDescription('Unexpected failure')]},
                );

                if (!(err instanceof CommandException))
                    CommandController.logger.warn(`Command "${command.command}" failed unexpectedly: ${err}`);
            }
        }
    }
}
