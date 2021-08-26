import {Controller} from '@nestjs/common';
import {Command} from './foundation/decorators/command.decorator';
import {TheCatApiService} from '../apis/thecatapi/thecatapi.service';
import {ClusterClient, Structures} from 'detritus-client';
import Interaction = Structures.Interaction;

@Controller()
export class CatsController {
    constructor(
        private readonly discord: ClusterClient,
        private readonly theCatApi: TheCatApiService,
    ) {
    }

    @Command({
        command: 'cats',
        description: 'Shows a random image of cats',
    })
    cats(interaction: Interaction): void {
        this.runCommand(interaction, false);
    }

    @Command({
        command: 'catsgif',
        description: 'Shows a random gif of cats',
    })
    catsGif(interaction: Interaction) {
        this.runCommand(interaction, true);
    }

    private runCommand(interaction: Interaction, gif: boolean) {
        this.theCatApi.imagesSearch({
            limit: 1,
            mime_types: gif ? ['gif'] : ['jpg', 'png'],
        })
            .subscribe(async ({data}) => {
                const {url} = data[0];

                await interaction.createResponse({
                    type: 4,
                    data: {
                        embed: {
                            image: {url},
                        },
                    },
                });
            });
    }
}
