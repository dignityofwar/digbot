import { Controller } from '@nestjs/common';
import { Command } from '../decorators/command.decorator';
import { TheCatsApiService } from '../../apis/thecatsapi/thecatsapi.service';
import { Message, MessageEmbed } from 'discord.js';

@Controller()
export class CatsController {
    constructor(
        private readonly catsApi: TheCatsApiService,
    ) {}

    @Command({
        command: '!cats',
        help: 'Shows a random image of cats',
    })
    cats(message: Message): void {
        this.catsApi.imagesSearch({
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
        this.catsApi.imagesSearch({
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
