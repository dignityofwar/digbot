import {Controller, Get, Param} from '@nestjs/common';
import {DiscordAccessor} from '../helpers/discord.accessor';

@Controller('/guilds')
export class GuildController {
    constructor(
        private readonly accessor: DiscordAccessor,
    ) {
    }

    @Get('/')
    guilds() {
        return this.accessor.getGuilds()
            .map(guild => ({
                id: guild.id,
                name: guild.name,
                description: guild.description,
            }));
    }

    @Get('/:guildId/roles')
    roles(
        @Param('guildId') guildId: string,
    ) {
        return this.accessor.getRoles(guildId)
            .map(role => ({
                id: role.id,
                name: role.name,
                color: role.color,
            }));
    }

    @Get('/:guildId/emojis')
    emojis(
        @Param('guildId') guildId: string,
    ) {
        return this.accessor.getEmojis(guildId)
            .map(emoji => ({
                id: emoji.id,
                name: emoji.name,
                animated: emoji.animated,
                url: emoji.url,
            }));
    }
}
