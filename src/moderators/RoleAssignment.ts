import Handler from '../bot/Handler';
import { Client, Emoji, Message, MessageEmbed, MessageReaction, PartialUser, User } from 'discord.js';
import { EntityManager } from 'typeorm';
import ReactionAssignment from '../models/ReactionAssignment';
import { catchAndLogAsync } from '../utils/logger';
import { getLogger } from '../logger';

export default class RoleAssignment extends Handler {
    private static logger = getLogger('role-assignment-moderator');

    /**
     * @param {EntityManager} manager
     */
    public constructor(
        private readonly manager: EntityManager,
    ) {
        super();
    }

    public up(client: Client): void {
        client.on('messageReactionAdd', this.onMessageReactionAdd.bind(this));
        client.on('messageReactionRemove', this.onMessageReactionRemove.bind(this));
    }

    @catchAndLogAsync(RoleAssignment.logger)
    public async onMessageReactionAdd(reaction: MessageReaction, user: User | PartialUser): Promise<void> {
        if (!reaction.message.guild) return;

        const [assignment, member] = await Promise.all([
            this.getAssignment(reaction.message, reaction.emoji),
            reaction.message.guild.member(user.id),
        ]);

        if (!assignment || !member || member.roles.cache.has(assignment.role)) return;



        await member.roles.add(assignment.role);

        await user.send(
            new MessageEmbed()
                .setColor('PURPLE')
                .setTitle('Role added')
                .setDescription(`You assigned yourself the role`),
        );
    }

    @catchAndLogAsync(RoleAssignment.logger)
    public async onMessageReactionRemove(reaction: MessageReaction, user: User | PartialUser): Promise<void> {

    }

    public async getAssignment(message: Message, emoji: Emoji): Promise<ReactionAssignment | null> {
        return await this.manager.findOne(ReactionAssignment, {where: {message: message.id, emoji: emoji.id}}) ?? null;
    }
}
