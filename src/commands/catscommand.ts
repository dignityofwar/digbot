import Command from './foundation/command';
import { injectable } from 'inversify';
import TheCatsApi from '../apis/thecatsapi';
import Request from './foundation/request';
import { RichEmbed } from 'discord.js';

@injectable()
export default class CatsCommand extends Command {
    public readonly name: string = 'cats';

    private api: TheCatsApi;

    constructor(api: TheCatsApi) {
        super();

        this.api = api;
    }

    public async execute(request: Request): Promise<void> {
        const img = await this.getCat(this.wantsGif(request.content));

        const response = await request.respond(new RichEmbed().setImage(img));

        await response.react('❤');
    }

    private wantsGif(content: string): boolean {
        return /^\Scats\s+gif/i.test(content);
    }

    private async getCat(gif: boolean): Promise<string> {
        try {
            return gif
                ? this.api.getGif()
                : this.api.getImg();
        } catch (e) {
            return 'https://i.imgur.com/fxorJTQ.jpg';
        }
    }
}
