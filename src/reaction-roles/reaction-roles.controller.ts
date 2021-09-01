import {Controller, Logger} from '@nestjs/common';
import {On} from '../discord/decorators/on.decorator';
import {SettingsService} from './settings.service';
import {ClusterClient, GatewayClientEvents} from 'detritus-client';
import {Client as RestClient} from 'detritus-client-rest';
import {timestampRelative} from '../utils/discord.utils';
import MessageReactionAdd = GatewayClientEvents.MessageReactionAdd;
import MessageReactionRemove = GatewayClientEvents.MessageReactionRemove;
import GuildMemberAdd = GatewayClientEvents.GuildMemberAdd;
import ClusterEvent = GatewayClientEvents.ClusterEvent;

@Controller()
export class ReactionRolesController {
    private static readonly logger = new Logger('ReactionRolesController');

    constructor(
        private readonly settings: SettingsService,
        private readonly client: ClusterClient,
        private readonly rest: RestClient,
    ) {
    }

    @On('messageReactionAdd')
    async reactionAdded({userId, channelId, messageId, reaction: {emoji}}: MessageReactionAdd) {
        const reactionRole = await this.settings.getRole(channelId, messageId, emoji.name, emoji.id);
        if (!reactionRole) return;

        const {guildId, roleId} = reactionRole;

        try {
            await this.rest.addGuildMemberRole(guildId, userId, roleId, {reason: 'ReactionRole'});
        } catch (err) {
            ReactionRolesController.logger.warn(`Unable to assign role "${reactionRole.id}": ${err}`);
        }
    }

    @On('messageReactionRemove')
    async reactionRemoved({userId, channelId, messageId, reaction: {emoji}}: MessageReactionRemove) {
        const reactionRole = await this.settings.getRole(channelId, messageId, emoji.name, emoji.id);
        if (!reactionRole) return;

        const {guildId, roleId} = reactionRole;

        try {
            await this.rest.removeGuildMemberRole(guildId, userId, roleId, {reason: `ReactionRole`});
        } catch (err) {
            ReactionRolesController.logger.warn(`Unable to remove role "${reactionRole.id}": ${err}`);
        }
    }

    @On('guildMemberAdd')
    async guildMemberAdd({member, guildId, shard}: GuildMemberAdd & ClusterEvent) {
        const [roles, settings] = await Promise.all([
            this.settings.getJoinRoles(guildId),
            this.settings.getJoinSettings(guildId),
        ]);
        if (roles.length == 0) return;

        const {description, expireDelay} = settings ?? {};
        const expireAt = this.calculateExpireAt(expireDelay);

        try {
            const guild = shard.guilds.get(guildId);
            const message = await member.createMessage({
                embed: {
                    title: `Reaction Roles for ${guild.name}`,
                    description: `${description ?? 'Assign yourself roles'}\n`
                        + roles.map(role => `<${role.isAnimated ? 'a' : ''}:${role.emojiName}:${role.emojiId}> ${role.name}`).join('\n'),
                    footer: {text: expireAt ? `Expires in ${timestampRelative(expireAt)}` : undefined},
                },
            });

            await Promise.all(
                roles.map(async (role) => {
                    try {
                        await this.rest.createReaction(
                            message.channelId,
                            message.id,
                            role.emojiId ? `${role.emojiName}:${role.emojiId}` : role.emojiName,
                        );

                        await this.settings.createJoinRole(message.channelId, message.id, role, expireAt);
                    } catch (e) {
                        ReactionRolesController.logger.warn(`Error when creating reaction role: ${e}`);
                    }
                }),
            );
        } catch (e) {
            ReactionRolesController.logger.warn(`Unable to send join message: ${e}`);
        }
    }

    private calculateExpireAt(expireDelay?: number): Date | null {
        if (!expireDelay) return null;

        const expireAt = new Date();
        expireAt.setHours(expireAt.getHours() + expireDelay);

        return expireAt;
    }
}
