import {Controller, Logger} from '@nestjs/common';
import {SettingsService} from './settings.service';
import {On} from '../discord/decorators/on.decorator';
import {GatewayClientEvents} from 'detritus-client';
import {DelayedJobs} from '../utils/delayed-jobs';
import GuildMemberUpdate = GatewayClientEvents.GuildMemberUpdate;
import ClusterEvent = GatewayClientEvents.ClusterEvent;
import {Member, Role} from 'detritus-client/lib/structures';

@Controller()
export class RoleHierarchyController {
    private static readonly logger = new Logger('AutoRoles');

    private static readonly PARENT_ROLE_EVALUATE_DELAY = 10000;

    private readonly queued = new DelayedJobs();

    constructor(
        private readonly settings: SettingsService,
    ) {
    }

    @On('guildMemberUpdate')
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

        const link = await this.settings.getParentsByRole(member.guildId, role.id);
        if (!link || member.roles.has(link.parentId)) return;

        try {
            await member.addRole(link.parentId, {reason: 'Assigned as parent role'});

            const parent = member.guild.roles.get(link.parentId);

            await member.createMessage({
                embed: {
                    title: `Auto-assigned role on ${member.guild.name}`,
                    description: `I have auto assigned you the role ${parent.name} as you have the role ${role.name}`,
                },
            });
        } catch (e) {
            RoleHierarchyController.logger.warn(`Something went wrong when auto assigning parent role "${link.roleId}": ${e}`);
        }
    }
}
