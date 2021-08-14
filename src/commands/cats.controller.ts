import {Controller} from '@nestjs/common';
import {Command} from './foundation/decorators/command.decorator';
import {TheCatApiService} from '../apis/thecatapi/thecatapi.service';
import {CommandInteraction, Message, MessageEmbed} from 'discord.js';

@Controller()
export class CatsController {
    constructor(
        private readonly theCatApi: TheCatApiService,
    ) {
    }

    @Command({
        command: 'cats',
        description: 'Shows a random image of cats',
    })
    cats(interaction: CommandInteraction): void {
        this.runCommand(interaction, false);
    }

    @Command({
        command: 'catsgif',
        description: 'Shows a random gif of cats',
    })
    catsGif(interaction: CommandInteraction) {
        this.runCommand(interaction, true);
    }

    private runCommand(interaction: CommandInteraction, gif: boolean) {
        this.theCatApi.imagesSearch({
            limit: 1,
            mime_types: gif ? ['gif'] : ['jpg', 'png'],
        })
            .subscribe(async ({data}) => {
                const reply = await interaction.reply(
                    {
                        embeds: [
                            new MessageEmbed()
                                .setImage(data[0].url),
                        ],
                        fetchReply: true,
                    });

                if (reply instanceof Message)
                    await reply.react('❤');
            });
    }
}
