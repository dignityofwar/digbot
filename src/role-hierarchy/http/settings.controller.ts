import {Controller, Delete, Get, Param, Post} from '@nestjs/common';
import {SettingsService} from '../services/settings.service';
import {DiscordAccessor} from '../../discord/helpers/discord.accessor';

@Controller('/role-hierarchy')
export class SettingsController {
    constructor(
        private readonly accessor: DiscordAccessor,
        private readonly settings: SettingsService,
    ) {
    }

    @Get('/:guildId')
    listLinks(
        @Param('guildId') guildId: string,
    ) {
        const guild = this.accessor.getGuild(guildId);

        return this.settings.getLinksByGuild(guild);
    }

    @Post('/:guildId/:roleId/:parentId')
    async createLink(
        @Param('guildId') guildId: string,
        @Param('roleId') roleId: string,
        @Param('parentId') parentId: string,
    ) {
        const role = this.accessor.getRole(guildId, roleId);
        const parent = this.accessor.getRole(guildId, parentId);

        await this.settings.createLink(role, parent);
    }

    @Delete('/:guildId/:roleId/:parentId')
    async deleteLink(
        @Param('guildId') guildId: string,
        @Param('roleId') roleId: string,
        @Param('parentId') parentId: string,
    ) {
        const role = this.accessor.getRole(guildId, roleId);
        const parent = this.accessor.getRole(guildId, parentId);

        await this.settings.deleteLink(role, parent);
    }
}
