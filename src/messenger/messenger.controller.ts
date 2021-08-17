import {Controller, Logger} from '@nestjs/common';
import {On} from '../discord/decorators/on.decorator';
import {ChannelManager, GuildMember, MessageEmbed, TextChannel} from 'discord.js';
import {SettingsService} from './settings.service';
import {MessengerBoost, MessengerJoin, MessengerRole} from '@prisma/client';

@Controller()
export class MessengerController {
    private static readonly logger = new Logger('MessengerController');

    constructor(
        private readonly settings: SettingsService,
        private readonly channelManager: ChannelManager,
    ) {
    }

    @On('guildMemberUpdate')
    async role(old: GuildMember, member: GuildMember) {
        if (member.user.bot) return;

        // TODO: Add ratelimiter

        const messages = await this.settings.getRoleMessagesByRoles(
            member.roles.cache
                .filter(role => !old.roles.cache.has(role.id))
                .map(role => role.id),
        );

        messages.forEach(message => this.message(member, message));
    }

    @On('guildMemberAdd')
    async join(member: GuildMember) {
        if (member.user.bot) return;

        // TODO: Add ratelimiter

        const messages = await this.settings.getJoinMessagesByGuild(member.guild.id);

        messages.forEach(message => this.message(member, message));
    }


    @On('guildMemberUpdate')
    async boost(old: GuildMember, member: GuildMember) {
        if (member.user.bot) return;
        if (!member.premiumSince || old.premiumSince) return;

        // TODO: Add ratelimiter

        const messages = await this.settings.getBoostMessagesByGuild(member.guild.id);

        messages.forEach(message => this.message(member, message));
    }

    private async message(member: GuildMember, message: MessengerRole | MessengerJoin | MessengerBoost): Promise<void> {
        try {
            if (message.channelId) {
                const channel = await this.channelManager.fetch(message.channelId) as TextChannel;

                await channel.send(this.formatMessage(message.message, member));
            } else {
                await member.send({
                    embeds: [
                        new MessageEmbed()
                            .setTitle(`Message from ${member.guild.name}`)
                            .setDescription(this.formatMessage(message.message, member)),
                    ],
                });
            }
        } catch (err) {
            MessengerController.logger.warn(`Unable to perform action "${message.id}" for member "${member.id}": ${err}`);
        }
    }

    private formatMessage(message: string, member: GuildMember): string {
        return message
            .replace(/(?<!\\)\$member/, member.toString())
            .replace(/(?<!\\)\$name/, member.displayName);
    }
}
