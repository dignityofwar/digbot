import {Controller, Logger} from '@nestjs/common';
import {SettingsService} from './settings.service';
import {On} from '../discord/decorators/on.decorator';
import {GatewayClientEvents} from 'detritus-client';
import {Client as RestClient} from 'detritus-client-rest/lib/client';
import GuildMemberUpdate = GatewayClientEvents.GuildMemberUpdate;
import ClusterEvent = GatewayClientEvents.ClusterEvent;
import Timeout = NodeJS.Timeout;

@Controller()
export class AutoRolesController {
    private static readonly logger = new Logger('AutoRoles');

    private static readonly PARENT_ROLE_EVALUATE_DELAY = 10000;

    private readonly queued = new Map<string, Timeout>();

    constructor(
        private readonly settings: SettingsService,
        private readonly rest: RestClient,
    ) {
    }

    @On('guildMemberUpdate')
    async role({member, old, shard}: GuildMemberUpdate & ClusterEvent) {
        if (member.bot) return;

        const queued = this.queued.get(member.id);
        if (queued) clearTimeout(queued);

        this.queued.set(
            member.id,
            setTimeout(async () => {
                this.queued.delete(member.id);

                const links = await this.settings.getParentsByRoles(
                    member.guildId,
                    Array.from(member.roles.keys())
                        .filter(role => !old.roles.has(role)),
                );

                links.filter(link => !member.roles.has(link.parentId))
                    .forEach(async (link) => {
                        try {
                            await this.rest.addGuildMemberRole(member.guildId, member.id, link.parentId, {reason: 'Assigned as parent role'});

                            const parent = shard.roles.get(member.guildId, link.parentId);

                            await member.createMessage({
                                embed: {
                                    title: `Auto-assigned role on ${member.guild.name}`,
                                    description: `I have auto assigned you the role ${parent.name} as you have the role ${member.roles.get(link.roleId).name}`,
                                },
                            });
                        } catch (e) {
                            AutoRolesController.logger.warn(`Something went wrong when auto assigning parent role "${link.roleId}": ${e}`);
                        }
                    });
            }, AutoRolesController.PARENT_ROLE_EVALUATE_DELAY).unref(),
        );
    }
}
