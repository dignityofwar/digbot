import {Controller, Logger} from '@nestjs/common';
import {GuildManager, MessageEmbed} from 'discord.js';
import {On} from '../discord/decorators/on.decorator';
import {SettingsService} from './settings.service';

@Controller()
export class ReactionRolesController {
    private static readonly logger = new Logger('ReactionRolesController');

    constructor(
        private readonly settings: SettingsService,
        private readonly guildManager: GuildManager,
    ) {
    }

    @On('raw')
    async reactionAdded(packet: any) {
        if (packet.t !== 'MESSAGE_REACTION_ADD') return;

        // TODO: Add ratelimiter


        const {user_id, message_id, emoji} = packet.d;

        const reactionRole = await this.settings.getRole(message_id, emoji.name);
        if (!reactionRole) return;

        try {
            const guild = await this.guildManager.fetch(reactionRole.guildId);
            const member = await guild.members.fetch(user_id);
            const role = await guild.roles.fetch(reactionRole.roleId);

            await member.roles.add(role);

            await member.send({
                embeds: [
                    new MessageEmbed()
                        .setTitle('Role Added')
                        .setDescription(`You assigned the \`${role.name}\` by reacting in ${guild.name}`),
                ],
            });
        } catch (err) {
            ReactionRolesController.logger.warn(`Unable to assign role "${reactionRole.id}": ${err}`);
        }
    }

    @On('raw')
    async reactionRemoved(packet: any) {
        if (packet.t !== 'MESSAGE_REACTION_REMOVE') return;

        // TODO: Add ratelimiter

        const {user_id, message_id, emoji} = packet.d;

        const reactionRole = await this.settings.getRole(message_id, emoji.name);
        if (!reactionRole) return;

        try {
            const guild = await this.guildManager.fetch(reactionRole.guildId);
            const member = await guild.members.fetch(user_id);
            const role = await guild.roles.fetch(reactionRole.roleId);

            await member.roles.remove(role);

            await member.send({
                embeds: [
                    new MessageEmbed()
                        .setTitle('Role Removed')
                        .setDescription(`You removed the \`${role.name}\` by unreacting in ${guild.name}`),
                ],
            });
        } catch (err) {
            ReactionRolesController.logger.warn(`Unable to remove role "${reactionRole.id}": ${err}`);
        }
    }
}
