import {Injectable, Logger} from '@nestjs/common';
import {ChannelManager, Guild, GuildMember, MessageEmbed, TextChannel} from 'discord.js';
import {InjectRepository} from '@nestjs/typeorm';
import {LogSettings} from './entities/log-settings.entity';
import {Repository} from 'typeorm';

@Injectable()
export class LogService {
    private static readonly logger = new Logger('LogSettingsService');

    constructor(
        @InjectRepository(LogSettings)
        private readonly settingsRepository: Repository<LogSettings>,
        private readonly channelManager: ChannelManager,
    ) {
    }

    async setChannel(channel: TextChannel): Promise<void> {
        const settings = await this.settingsRepository.findOne({guildId: channel.guild.id})
            ?? this.settingsRepository.create({
                guildId: channel.guild.id,
            });

        settings.channelId = channel.id;

        await this.settingsRepository.save(settings);
    }

    async log(label: string, guild: Guild, message: string, member?: GuildMember): Promise<void> {
        const settings = await this.settingsRepository.findOne({guildId: guild.id});
        if (!settings) return;

        try {
            const channel = await this.channelManager.fetch(settings.channelId) as TextChannel;

            await channel.send(this.formatLog(label, message, member));

        } catch (err) {
            LogService.logger.warn(`Unable to send log for guild "${guild.id}" to channel "${settings.channelId}": ${err}`);
        }
    }

    private formatLog(label: string, message: string, member?: GuildMember): MessageEmbed {
        return new MessageEmbed()
            .setDescription(message)
            .setFooter(
                member
                    ? `${label} | ${member.displayName}(${member.id})`
                    : label,
            )
            .setColor('PURPLE');
    }
}
