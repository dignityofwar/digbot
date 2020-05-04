import Handler from '../bot/handler';
import { Client, Message } from 'discord.js';
import RateLimiter, { RATELIMITER } from '../utils/ratelimiter/ratelimiter';
import { inject, injectable } from 'inversify';
import AntiSpamConfig from '../models/antispamconfig';
import { EntityManager } from 'typeorm';

@injectable()
export default class AntiSpam extends Handler {
    /**
     * @param {EntityManager} manager
     * @param {RateLimiter} rateLimiter
     */
    public constructor(
        private readonly manager: EntityManager,
        @inject(RATELIMITER) private readonly rateLimiter: RateLimiter,
    ) {
        super();
    }

    /**
     * @param {Client} client
     */
    public up(client: Client): void {
        client.on('message', this.onMessage.bind(this));
    }

    /**
     * @param {Message} message
     * @return {Promise<void>}
     */
    public async onMessage(message: Message): Promise<void> {
        if (message.author.bot || message.channel.type !== 'text')
            return;

        if (!this.hasMentions(message))
            return;

        const config = await this.manager.findOne(AntiSpamConfig);

        if (!config)
            return;

        const key = this.throttleKey(message);

        const hits = this.calcHits(message, config);
        const totalHits = await this.rateLimiter.hit(key, config.decay, );

        if ()
    }

    /**
     * @param {MessageMentions} mentions
     * @return {boolean}
     */
    private hasMentions({mentions}: Message): boolean {
        return mentions.everyone
            || mentions.users.size > 0
            || mentions.roles.size > 0;
    }

    /**
     * @param {MessageMentions} mentions
     * @param {AntiSpamConfig} config
     * @return {number}
     */
    private calcHits({mentions}: Message, config: AntiSpamConfig): number {
        let hits = 0;

        if (mentions.everyone)
            hits += config.everyoneWeight;

        hits += mentions.users.size * config.userWeight;
        hits += mentions.roles.size * config.roleWeight;

        return hits;

    }

    /**
     * @return {string}
     */
    private throttleKey(message: Message): string {
        return `antispam:${message.guild!.id}:${message.author.id}`;
    }
}
