import {Injectable, Logger} from '@nestjs/common';
import {DiscordEvent} from '../../discord/foundation/decorators/discord-event.decorator';
import {SettingsService} from '../services/settings.service';
import {ClusterClient, GatewayClientEvents} from 'detritus-client';
import {Member} from 'detritus-client/lib/structures';
import {DelayedJobs} from '../../utils/delayed-jobs';
import {Client as RestClient} from 'detritus-client-rest';
import {timestampRelative} from '../../discord/utils/reference.helpers';
import {DiscordAccessor} from '../../discord/helpers/discord.accessor';
import {OnJoinRole} from '../entities/on-join-role.entity';

@Injectable()
export class ReactionRolesController {
    private readonly queued = new DelayedJobs();

    constructor(
        private readonly logger: Logger,
        private readonly settings: SettingsService,
        private readonly client: ClusterClient,
        private readonly rest: RestClient,
        private readonly discordAccessor: DiscordAccessor,
    ) {
    }

    @DiscordEvent('messageReactionAdd')
    async reactionAdded({userId, channelId, messageId, reaction: {emoji}}: GatewayClientEvents.MessageReactionAdd) {
        const reactionRole = await this.settings.getRole(channelId, messageId, emoji.name, emoji.id);
        if (!reactionRole) return;

        try {
            await this.rest.addGuildMemberRole(reactionRole.guild.id, userId, reactionRole.role.id, {reason: 'ReactionRole'});
        } catch (err) {
            this.logger.warn(`Unable to assign role "${reactionRole.id}": ${err}`);
        }
    }

    @DiscordEvent('messageReactionRemove')
    async reactionRemoved({
                              userId,
                              channelId,
                              messageId,
                              reaction: {emoji},
                          }: GatewayClientEvents.MessageReactionRemove) {
        const reactionRole = await this.settings.getRole(channelId, messageId, emoji.name, emoji.id);
        if (!reactionRole) return;

        try {
            await this.rest.removeGuildMemberRole(reactionRole.guild.id, userId, reactionRole.role.id, {reason: `ReactionRole`});
        } catch (err) {
            this.logger.warn(`Unable to remove role "${reactionRole.id}": ${err}`);
        }
    }

    @DiscordEvent('guildMemberAdd')
    async guildMemberAdd({member}: GatewayClientEvents.GuildMemberAdd) {
        this.planEvaluateMember(member);
    }

    @DiscordEvent('guildMemberRemove')
    guildMemberRemove({member}: GatewayClientEvents.GuildMemberRemove) {
        this.cancelEvaluate(member);
    }

    private async planEvaluateMember(member: Member): Promise<void> {
        const key = this.evaluateKey(member);
        if (this.queued.has(key)) return;

        const [roles, settings] = await Promise.all([
            this.settings.getJoinRoles(member.guildId),
            this.settings.getJoinSettings(member.guildId),
        ]);

        if (roles.length == 0) return;

        this.queued.queue(
            key,
            (settings.delay ?? 0) * 60 * 1000,
            async () => {
                if (member.roles.length > 0) return;

                const {description, expireDelay} = settings ?? {};
                const expireAt = this.calculateExpireAt(expireDelay);

                try {
                    const {guild} = member;

                    const message = await member.createMessage({
                        embed: {
                            title: `Reaction Roles for ${guild.name}`,
                            description: `${description ?? 'Assign yourself roles'}\n`
                                + roles.map(role => `${this.emojiToString(role)} ${role.name}`).join('\n'),
                            footer: {text: expireAt ? `Expires in ${timestampRelative(expireAt)}` : undefined},
                        },
                    });

                    await Promise.all(
                        roles.map(async (role) => {
                            try {
                                await this.rest.createReaction(
                                    message.channelId,
                                    message.id,
                                    role.emoji ? `${role.emojiName}:${role.emoji.id}` : role.emojiName,
                                );

                                await this.settings.createJoinRole(message.channelId, message.id, role, expireAt);
                            } catch (e) {
                                this.logger.warn(`Error when creating reaction role: ${e}`);
                            }
                        }),
                    );
                } catch (e) {
                    this.logger.warn(`Unable to send join message: ${e}`);
                }
            },
        );
    }

    private cancelEvaluate(member: Member): void {
        const key = this.evaluateKey(member);

        this.queued.cancel(key);
    }

    private evaluateKey(member: Member): string {
        return `${member.guildId}:${member.id}`;
    }

    private calculateExpireAt(expireDelay?: number): Date | null {
        if (!expireDelay) return null;

        const expireAt = new Date();
        expireAt.setHours(expireAt.getHours() + expireDelay);

        return expireAt;
    }

    private emojiToString(role: OnJoinRole): string {
        if (!role.emoji)
            return `<:${role.emojiName}:>`;

        return this.discordAccessor.getEmoji(role.guild.id, role.emoji.id).toString();
    }
}
