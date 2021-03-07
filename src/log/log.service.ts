import {Injectable, Logger} from '@nestjs/common';
import {ChannelManager, Guild, MessageEmbed, TextChannel} from 'discord.js';
import {InjectRepository} from '@nestjs/typeorm';
import {LogSettings} from './entities/log-settings.entity';
import {Repository} from 'typeorm';
import {DiscordClient} from '../discord/foundation/discord.client';

@Injectable()
export class LogService {
    private static readonly logger = new Logger('LogSettingsService');

    private readonly channelManager: ChannelManager;

    constructor(
        @InjectRepository(LogSettings)
        private readonly settingsRepository: Repository<LogSettings>,
        discordClient: DiscordClient,
    ) {
        this.channelManager = discordClient.channels;
    }

    async log(label: string, guild: Guild, message: string): Promise<void> {
        const settings = await this.settingsRepository.findOne({guildId: guild.id});
        if (!settings) return;

        try {
            const channel = await this.channelManager.fetch(settings.channelId) as TextChannel;

            await channel.send(this.formatLog(label, message));

        } catch (err) {
            LogService.logger.warn(`Unable to send log for guild "${guild.id}" to channel "${settings.channelId}": ${err}`);
        }
    }

    private formatLog(label: string, message: string): MessageEmbed {
        return new MessageEmbed()
            .setDescription(message)
            .setFooter(label)
            .setColor('PURPLE');
    }
}
