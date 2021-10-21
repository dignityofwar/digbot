import {Controller, Get, Param} from '@nestjs/common';
import {SettingsService} from '../services/settings.service';
import {DiscordAccessor} from '../../discord/helpers/discord.accessor';

@Controller('/reaction-roles')
export class SettingsController {
    constructor(
        private readonly accessor: DiscordAccessor,
        private readonly settings: SettingsService,
    ) {
    }

    @Get('/:guildId/static')
    listStatic(
        @Param('guildId') guildId: string,
    ) {
        this.accessor.getGuild(guildId);

        return this.settings.getStaticRolesByGuild(guildId);
    }
}
