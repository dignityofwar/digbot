import { Controller } from '@nestjs/common';
import { Command } from '../decorators/command.decorator';
import { TheCatApiService } from '../../apis/thecatapi/thecatapi.service';
import { Message, MessageEmbed } from 'discord.js';

@Controller()
export class CatsController {
    constructor(
        private readonly theCatApi: TheCatApiService,
    ) {}

    @Command({
        command: '!cats',
        help: 'Shows a random image of cats',
    })
    cats(message: Message): void {
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
        help: 'Shows a random gif of cats',
    })
    catsGif(message: Message) {
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
