import {Controller} from '@nestjs/common';
import {Command} from './foundation/decorators/command.decorator';
import {TheCatApiService} from '../apis/thecatapi/thecatapi.service';
import {MessageEmbed} from 'discord.js';
import {CommandRequest} from './foundation/command.request';

@Controller()
export class CatsController {
    constructor(
        private readonly theCatApi: TheCatApiService,
    ) {
    }

    @Command({
        command: '!cats',
        description: 'Shows a random image of cats',
    })
    cats({message}: CommandRequest): void {
        this.theCatApi.imagesSearch({
            limit: 1,
            mime_types: ['jpg', 'png'],
        })
            .subscribe(async ({data}) => {
                const reply = await message.channel.send(this.createEmbed(data[0].url));
                await reply.react('❤');
            });
    }

    @Command({
        command: '!cats:gif',
        description: 'Shows a random gif of cats',
    })
    catsGif({message}: CommandRequest) {
        this.theCatApi.imagesSearch({
            limit: 1,
            mime_types: ['gif'],
        })
            .subscribe(async ({data}) => {
                const reply = await message.channel.send(this.createEmbed(data[0].url));
                await reply.react('❤');
            });
    }

    private createEmbed(url: string) {
        return new MessageEmbed({
            image: {url},
        });
    }
}
