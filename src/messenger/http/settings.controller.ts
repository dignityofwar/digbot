import {Controller, Get, Param} from '@nestjs/common';
import {DiscordAccessor} from '../../discord/helpers/discord.accessor';
import {SettingsService} from '../settings.service';

@Controller('/messenger')
export class SettingsController {
    constructor(
        private readonly accessor: DiscordAccessor,
        private readonly settings: SettingsService,
    ) {
    }

    @Get('/:guildId/join')
    listJoin(
        @Param('guildId') guildId: string,
    ) {
        this.accessor.getGuildOrFail(guildId);

        return this.settings.getJoinMessagesByGuild(guildId);
    }

    @Get('/:guildId/boost')
    listBoost(
        @Param('guildId') guildId: string,
    ) {
        this.accessor.getGuildOrFail(guildId);

        return this.settings.getBoostMessagesByGuild(guildId);
    }

    @Get('/:guildId/role/:roleId')
    listRole(
        @Param('guildId') guildId: string,
        @Param('roleId') roleId: string,
    ) {
        const guild = this.accessor.getGuildOrFail(guildId);
        this.accessor.getRoleOrFail(guild, roleId);

        return this.settings.getRoleMessagesByRoles(guildId, [roleId]);
    }
}
