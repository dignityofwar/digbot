import Command from './foundation/command';
import { injectable } from 'inversify';
import JService from '../services/jservice';
import Request from './foundation/request';
import { MessageEmbed } from 'discord.js';

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

        await request.respond(
            new MessageEmbed()
                .setColor(4650701)
                .setTitle(question)
                .setDescription(`||${answer}||`)
                .setFooter(`id: ${id} | category: ${title}`),
        );
    }
}
