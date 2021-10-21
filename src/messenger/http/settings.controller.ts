import {Controller, Get, Param} from '@nestjs/common';
import {DiscordAccessor} from '../../discord/helpers/discord.accessor';
import {SettingsService} from '../services/settings.service';

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
        const guild = this.accessor.getGuild(guildId);

        return this.settings.getJoinMessagesByGuild(guild);
    }

    @Get('/:guildId/boost')
    listBoost(
        @Param('guildId') guildId: string,
    ) {
        const guild = this.accessor.getGuild(guildId);

        return this.settings.getBoostMessagesByGuild(guild);
    }

    @Get('/:guildId/role/:roleId')
    listRole(
        @Param('guildId') guildId: string,
        @Param('roleId') roleId: string,
    ) {
        const role = this.accessor.getRole(guildId, roleId);

        return this.settings.getRoleMessagesByRole(role);
    }
}
