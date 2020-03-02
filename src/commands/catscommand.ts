import Command from './foundation/command';
import { injectable } from 'inversify';
import TheCatsApi from '../apis/thecatsapi';
import Request from './foundation/request';
import { MessageEmbed } from 'discord.js';

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
     * @param {TheCatsApi} api the api that should be used
     */
    public constructor(api: TheCatsApi) {
        super();

        this.api = api;
    }

    /**
     * Retrieves a cat images based on the request, and sends it to the channel with a heart emoji as a reaction
     *
     * @param {Request} request the request that triggered the command
     * @return {Promise<void>} promise which returns nothing when the command executed
     */
    public async execute(request: Request): Promise<void> {
        const img = await this.getCat(/^gif$/i.test(request.argv[0]));

        const response = await request.respond(new MessageEmbed().setImage(img));

        await response.react('❤');
    }

    /**
     * Retrieves a cat image from the api
     *
     * @param {boolean} gif true if the user wants a gif, false for a static image
     * @return {Promise<string>} a url to a image(guaranteed)
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
