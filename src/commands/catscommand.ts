import Command from './foundation/command';
import { injectable } from 'inversify';
import TheCatsApi from '../apis/thecatsapi';
import Request from './foundation/request';
import { RichEmbed } from 'discord.js';

/**
 * A command that retrieves cat pictures from the Cat Api.
 */
@injectable()
export default class CatsCommand extends Command {
    /**
     * The name of the command(without spaces)
     */
    public readonly name: string = '!cats';

    /**
     * The api that should be used by the command
     */
    private api: TheCatsApi;

    /**
     * Constructor for the CatsCommand
     *
     * @param api the api that should be used
     */
    public constructor(api: TheCatsApi) {
        super();

        this.api = api;
    }

    /**
     * Retrieves a cat images based on the request, and sends it to the channel with a heart emoji as a reaction
     *
     * @param request the request that triggered the command
     */
    public async execute(request: Request): Promise<void> {
        const img = await this.getCat(request.argv.includes('-g') || request.argv.includes('--gif'));

        const response = await request.respond(new RichEmbed().setImage(img));

        await response.react('❤');
    }

    /**
     * Retrieves a cat image from the api
     *
     * @param gif true if the user wants a gif, false for a static image
     */
    private async getCat(gif: boolean): Promise<string> {
        try {
            return gif
                ? await this.api.getGif()
                : await this.api.getImg();
        } catch (e) {
            return 'https://i.imgur.com/fxorJTQ.jpg';
        }
    }
}
