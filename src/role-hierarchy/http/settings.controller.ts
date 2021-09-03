import {Controller, Delete, Get, Param, Post} from '@nestjs/common';
import {SettingsService} from '../settings.service';
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
        const guild = this.accessor.getGuildOrFail(guildId);

        return this.settings.getLinksByGuild(guild.id);
    }

    @Post('/:guildId/:roleId/:parentId')
    async createLink(
        @Param('guildId') guildId: string,
        @Param('roleId') roleId: string,
        @Param('parentId') parentId: string,
    ) {
        const guild = this.accessor.getGuildOrFail(guildId);
        this.accessor.getRoleOrFail(guild, roleId);
        this.accessor.getRoleOrFail(guild, parentId);

        await this.settings.createLink(guildId, roleId, parentId);
    }

    @Delete('/:guildId/:roleId/:parentId')
    async deleteLink(
        @Param('guildId') guildId: string,
        @Param('roleId') roleId: string,
        @Param('parentId') parentId: string,
    ) {
        const guild = this.accessor.getGuildOrFail(guildId);
        this.accessor.getRoleOrFail(guild, roleId);
        this.accessor.getRoleOrFail(guild, parentId);

        await this.settings.deleteLink(guildId, roleId, parentId);
    }
}
