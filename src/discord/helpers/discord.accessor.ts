import {Injectable, NotFoundException} from '@nestjs/common';
import {ClusterClient} from 'detritus-client';
import {Emoji, Guild, Role} from 'detritus-client/lib/structures';

@Injectable()
export class DiscordAccessor {
    constructor(
        private readonly discord: ClusterClient,
    ) {
    }

    getGuilds(): Guild[] {
        return this.discord.shards.map(
            shard => shard.guilds.toArray(),
        ).flat();
    }

    getGuild(guildId: string): Guild | null {
        const shardId = (Number.parseInt(guildId, 10) >> 22) % this.discord.shardCount;

        return this.discord.shards.get(shardId)
            .guilds.get(guildId) ?? null;
    }

    getGuildOrFail(guildId: string): Guild | null {
        const guild = this.getGuild(guildId);
        if (guild) return guild;

        throw new NotFoundException('Guild Not Found');
    }

    getRoles(guild: Guild): Role[] {
        return guild.roles.toArray();
    }

    getRole(guild: Guild, roleId: string): Role | null {
        return guild.roles.get(roleId) ?? null;
    }

    getRoleOrFail(guild: Guild, roleId: string): Role {
        const role = this.getRole(guild, roleId);
        if (role) return role;

        throw new NotFoundException('Role Not Found');
    }

    getEmojis(guild: Guild): Emoji[] {
        return guild.emojis.toArray();
    }

    getEmoji(guild: Guild, emojiId: string): Emoji | null {
        return guild.emojis.get(emojiId) ?? null;
    }

    getEmojiOrFail(guild: Guild, emojiId: string): Emoji {
        const emoji = this.getEmoji(guild, emojiId);
        if (emoji) return emoji;

        throw new NotFoundException('Emoji Not Found');
    }
}
