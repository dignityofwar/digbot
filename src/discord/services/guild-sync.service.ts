import {DiscordEvent} from '../foundation/decorators/discord-event.decorator';
import {Injectable, Logger, OnModuleInit} from '@nestjs/common';
import {Guild} from '../entities/guild.entity';
import {GatewayClientEvents} from 'detritus-client';
import {EntityManager} from '@mikro-orm/mariadb';
import {Role} from '../entities/role.entity';
import {Channel} from '../entities/channel.entity';
import {Emoji} from '../entities/emoji.entity';

@Injectable()
export class GuildSyncService implements OnModuleInit {
    constructor(
        private readonly logger: Logger,
        private readonly entityManager: EntityManager,
    ) {
    }

    async onModuleInit(): Promise<void> {
        this.logger.log('Initializing synced guilds');

        await this.entityManager.nativeUpdate(Guild, {}, {inactiveSince: new Date()});
    }

    @DiscordEvent('guildCreate')
    async guildCreate({guild, fromUnavailable}: GatewayClientEvents.GuildCreate) {
        this.logger.log(`Guild "${guild.name}"(${guild.id}) became active: ${JSON.stringify({fromUnavailable})}`);

        await this.entityManager.createQueryBuilder(Guild)
            .insert({id: guild.id, inactiveSince: null})
            .onConflict('id')
            .merge()
            .execute();

        await Promise.all([
            this.entityManager.createQueryBuilder(Role)
                .insert(guild.roles.map(role => ({id: role.id, guild_id: guild.id})))
                .onConflict('id')
                .merge()
                .execute(),
            this.entityManager.createQueryBuilder(Channel)
                .insert(guild.channels.map(channel => ({id: channel.id, guild_id: guild.id})))
                .onConflict('id')
                .merge()
                .execute(),
            this.entityManager.createQueryBuilder(Emoji)
                .insert(guild.emojis.map(emoji => ({id: emoji.id, guild_id: guild.id})))
                .onConflict('id')
                .merge()
                .execute(),
        ]);

        // Clean-up
        await Promise.all([
            this.entityManager.createQueryBuilder(Role)
                .delete({
                    guild_id: guild.id,
                    id: {$nin: Array.from(guild.roles.keys())},
                }).execute(),
            this.entityManager.createQueryBuilder(Channel)
                .delete({
                    guild_id: guild.id,
                    id: {$nin: Array.from(guild.channels.keys())},
                }).execute(),
            this.entityManager.createQueryBuilder(Emoji)
                .delete({
                    guild_id: guild.id,
                    id: {$nin: Array.from(guild.emojis.keys())},
                }).execute(),
        ]);
    }

    @DiscordEvent('guildDelete')
    async guildDelete({guild, guildId, isUnavailable}: GatewayClientEvents.GuildDelete) {
        if (!isUnavailable) {
            this.logger.log(
                isUnavailable
                    ? `Guild "${guild.name ?? 'unkown'}"(${guildId}) became inactive`
                    : `Guild "${guild.name ?? 'unkown'}"(${guildId}) became unavailable`,
            );

            await this.entityManager.createQueryBuilder(Guild)
                .update({inactiveSince: new Date()})
                .where({id: guildId})
                .execute();
        }
    }

    @DiscordEvent('guildRoleCreate')
    async roleCreate({role}: GatewayClientEvents.GuildRoleCreate) {
        await this.entityManager.createQueryBuilder(Role)
            .insert({id: role.id, guild_id: role.guildId, unavailable: false})
            .execute();
    }

    @DiscordEvent('guildRoleDelete')
    async roleDelete({roleId, guildId}: GatewayClientEvents.GuildRoleDelete) {
        await this.entityManager.createQueryBuilder(Role)
            .delete({id: roleId, guild_id: guildId})
            .execute();
    }

    @DiscordEvent('channelCreate')
    async channelCreate({channel}: GatewayClientEvents.ChannelCreate) {
        await this.entityManager.createQueryBuilder(Channel)
            .insert({id: channel.id, guild_id: channel.guildId})
            .execute();
    }

    @DiscordEvent('channelDelete')
    async channelDelete({channel}: GatewayClientEvents.ChannelDelete) {
        await this.entityManager.createQueryBuilder(Channel)
            .delete({id: channel.id, guild_id: channel.guildId})
            .execute();
    }

    @DiscordEvent('guildEmojisUpdate')
    async emojisUpdate({differences, guildId}: GatewayClientEvents.GuildEmojisUpdate) {
        if (differences.created.length > 0)
            await this.entityManager.createQueryBuilder(Emoji)
                .insert(differences.created.map(emoji => ({id: emoji.id, guild_id: guildId})))
                .execute();

        if (differences.deleted.length > 0)
            await this.entityManager.createQueryBuilder(Emoji)
                .delete({guild_id: guildId, id: {$in: differences.deleted.map(emoji => emoji.id)}})
                .execute();

    }
}
