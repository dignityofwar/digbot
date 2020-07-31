import Handler from '../../bot/Handler';
import { Client, Guild, GuildMember, Message, MessageEmbed, PartialGuildMember, User } from 'discord.js';
import RateLimiter, { RATELIMITER } from '../../utils/ratelimiter/RateLimiter';
import { inject, injectable } from 'inversify';
import AntiSpamConfig from '../../models/AntiSpamConfig';
import { EntityManager } from 'typeorm';
import { catchAndLogAsync } from '../../utils/logger';
import { getLogger } from '../../logger';

@injectable()
export default class AntiSpamHandler extends Handler {
    private static readonly logger = getLogger('anti-spam-moderator');

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
        client.on('guildMemberUpdate', this.onGuildMemberUpdate.bind(this));
    }

    /**
     * @param {GuildMember | PartialGuildMember} old
     * @param {GuildMember | PartialGuildMember} member
     * @return {Promise<void>}
     */
    @catchAndLogAsync(AntiSpamHandler.logger)
    public async onGuildMemberUpdate(old: GuildMember | PartialGuildMember, member: GuildMember | PartialGuildMember): Promise<void> {
        const config = await this.getConfig(old.guild);

        if (!config) return;

        if (old.roles.cache.has(config.muteRole) && !member.roles.cache.has(config.muteRole)) {
            await this.rateLimiter.resetAttempts(this.throttleKey(old.guild, old));
        }
    }

    /**
     * @param {Message} message
     * @return {Promise<void>}
     */
    @catchAndLogAsync(AntiSpamHandler.logger)
    public async onMessage(message: Message): Promise<void> {
        if (message.author.bot || !message.member || !message.guild) return;

        if (message.member.hasPermission('ADMINISTRATOR')) return;

        if (!this.hasMentions(message)) return;

        const config = await this.getConfig(message.guild);

        if (!config) return;

        const key = this.throttleKey(message.guild, message.author);
        const hits = this.calcHits(message, config);

        if (hits === 0) return;

        const totalHits = await this.rateLimiter.hit(key, config.decay, hits);

        if (config.threshold <= totalHits) {
            if (config.threshold > totalHits - hits)
                await this.warnMember(message.member);
            else
                await this.muteMember(message.member, config.muteRole);
        }
    }

    /**
     * @param {GuildMember} member
     */
    private async warnMember(member: GuildMember): Promise<void> {
        await member.send(
            new MessageEmbed()
                .setColor('ORANGE')
                .setTitle('Mention Spam warning')
                .setDescription(`You have exceeded the mention limit of ${member.guild.name}.`)
                .setFooter('Ignoring this warning will result in a mute.'),
        );
    }

    /**
     * @param {GuildMember} member
     * @param {string} muteRole
     */
    private async muteMember(member: GuildMember, muteRole: string): Promise<void> {
        await Promise.all([
            member.send(
                new MessageEmbed()
                    .setColor('RED')
                    .setTitle('Mention Spam limit exceed')
                    .setDescription(`You have exceeded the mention limit of ${member.guild.name} you are now muted.`),
            ),
            member.roles.add(muteRole, 'Exceed mention spam limit'),
        ]);
        // TODO: System for releasing member and persisting mute on rejoin
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
        return (+mentions.everyone) * config.everyoneWeight
            + mentions.users.size * config.userWeight
            + mentions.roles.size * config.roleWeight;
    }

    /**
     * @return {string}
     */
    private throttleKey(guild: Guild, user: User | GuildMember | PartialGuildMember): string {
        return `antispam:${guild.id}:${user.id}`;
    }

    /**
     * @param {Guild} guild
     * @return {Promise<AntiSpamConfig | null>}
     */
    private async getConfig(guild: Guild): Promise<AntiSpamConfig | null> {
        // TODO: cache config
        return await this.manager.findOne(AntiSpamConfig, {guild: guild.id}) ?? null;
    }
}
