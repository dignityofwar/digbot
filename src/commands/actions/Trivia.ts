import Action from '../Action';
import { injectable } from 'inversify';
import JService from '../../services/JService';
import Request from '../Request';
import { MessageEmbed } from 'discord.js';

@injectable()
export default class Trivia extends Action {
    /**
     * @param {JService} api
     */
    public constructor(private readonly api: JService) {
        super('trivia');
    }

    /**
     * @param {Request} request
     * @return {Promise<void>}
     */
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
