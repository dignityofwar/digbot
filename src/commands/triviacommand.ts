import Command from './foundation/command';
import { injectable } from 'inversify';
import JService from '../apis/jservice';
import Request from './foundation/request';
import { RichEmbed } from 'discord.js';

@injectable()
export default class TriviaCommand extends Command {
    public readonly name: string = '!trivia';

    private readonly api: JService;

    public constructor(api: JService) {
        super();

        this.api = api;
    }

    public async execute(request: Request): Promise<void> {
        const {id, question, answer, category: {title}} = await this.api.random();

        request.respond(
            new RichEmbed()
                .setColor(4650701)
                .setTitle(question)
                .setDescription(`||${answer}||`)
                .setFooter(`${id} | ${title}`),
        );
    }
}
