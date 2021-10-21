import {Injectable, NotFoundException} from '@nestjs/common';
import {ClusterClient, ShardClient} from 'detritus-client';
import {Emoji, Guild, Role} from 'detritus-client/lib/structures';

@Injectable()
export class DiscordAccessor {
    constructor(
        private readonly discord: ClusterClient,
    ) {
    }

    getGuilds(): Guild[] {
        return this.discord.shards.map(
            shard => shard.guilds.toArray().filter(guild => !guild.unavailable),
        ).flat();
    }

    getGuild(guildId: string): Guild {
        const shard = this.getShard(guildId);
        const guild = shard.guilds.get(guildId);

        if (!guild)
            throw new NotFoundException('Guild not found');

        if (guild.unavailable)
            throw new NotFoundException('Guild not available');

        return guild;
    }

    getRoles(guildId: string): Role[] {
        return this.getGuild(guildId).roles.toArray();
    }

    getRole(guildId: string, roleId: string): Role {
        const shard = this.getShard(guildId);
        const role = shard.roles.get(guildId, roleId);

        if (!role)
            throw new NotFoundException('Role not found');

        return role;
    }

    getEmojis(guildId: string): Emoji[] {
        return this.getGuild(guildId).emojis.toArray();
    }

    getEmoji(guildId: string, emojiId: string): Emoji {
        const shard = this.getShard(guildId);
        const emoji = shard.emojis.get(guildId, emojiId);

        if (!emoji)
            throw new NotFoundException('Emoji not found');

        return emoji;
    }

    private getShard(guildId: string): ShardClient {
        return this.discord.shards.get(
            Number(BigInt(guildId) >> 22n) % this.discord.shardCount,
        );
    }
}
