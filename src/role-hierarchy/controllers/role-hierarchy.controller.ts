import {Injectable, Logger} from '@nestjs/common';
import {SettingsService} from '../services/settings.service';
import {DiscordEvent} from '../../discord/foundation/decorators/discord-event.decorator';
import {GatewayClientEvents} from 'detritus-client';
import {DelayedJobs} from '../../utils/delayed-jobs';
import {Member, Role} from 'detritus-client/lib/structures';
import GuildMemberUpdate = GatewayClientEvents.GuildMemberUpdate;
import ClusterEvent = GatewayClientEvents.ClusterEvent;

@Injectable()
export class RoleHierarchyController {
    private static readonly logger = new Logger('AutoRoles');

    private static readonly PARENT_ROLE_EVALUATE_DELAY = 10000;

    private readonly queued = new DelayedJobs();

    constructor(
        private readonly settings: SettingsService,
    ) {
    }

    @DiscordEvent('guildMemberUpdate')
    async role({member, old}: GuildMemberUpdate & ClusterEvent) {
        if (member.bot) return;

        const addedRoles = member.roles.toArray()
            .filter(role => !old.roles.has(role.id));

        for (const role of addedRoles) {
            const key = `${member.guildId}:${member.id}:${role.id}`;
            if (this.queued.has(key)) continue;

            this.queued.queue(
                key,
                RoleHierarchyController.PARENT_ROLE_EVALUATE_DELAY,
                () => this.evaluateRole(member, role),
            );
        }
    }

    private async evaluateRole(member: Member, role: Role): Promise<void> {
        if (!member.roles.has(role.id)) return;

        const link = await this.settings.getParentsByRole(role);
        if (!link || member.roles.has(link.parent.id)) return;

        try {
            await member.addRole(link.parent.id, {reason: 'Assigned as parent role'});

            const parent = member.guild.roles.get(link.parent.id);

            await member.createMessage({
                embed: {
                    title: `Auto-assigned role on ${member.guild.name}`,
                    description: `I have auto assigned you the role ${parent.name} as you have the role ${role.name}`,
                },
            });
        } catch (e) {
            RoleHierarchyController.logger.warn(`Something went wrong when auto assigning parent role "${link.role.id}": ${e}`);
        }
    }
}
