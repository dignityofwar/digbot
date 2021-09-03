import {Controller, Get, Param, Post} from '@nestjs/common';
import {SettingsService} from '../settings.service';
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
        this.accessor.getGuildOrFail(guildId);

        return this.settings.getStaticRolesByGuild(guildId);
    }

    @Post()
    createStatic(
        @Param('guildId') guildId: string,
    ) {
        this.accessor.getGuildOrFail(guildId);
    }
}
