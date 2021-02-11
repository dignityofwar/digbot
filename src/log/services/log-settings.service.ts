import {Injectable, Logger} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {LogSettings} from '../entities/log-settings.entity';
import {Repository} from 'typeorm';
import {DiscordClient} from '../../discord/foundation/discord.client';
import {ChannelManager, Guild, TextChannel} from 'discord.js';

@Injectable()
export class LogSettingsService {
    private static readonly logger = new Logger('LogSettingsService');

    private readonly cache = new Map<string, LogSettings>();

    private readonly channelManager: ChannelManager;

    constructor(
        @InjectRepository(LogSettings)
        private readonly logSettingsRepository: Repository<LogSettings>,
        private readonly discordClient: DiscordClient,
    ) {
        this.channelManager = discordClient.channels;
    }

    async get(guild: Guild): Promise<LogSettings | undefined> {
        if (this.cache.has(guild.id))
            return this.cache.get(guild.id);

        const settings = await this.logSettingsRepository.findOne({guild: guild.id});

        try {
            settings.textChannel = await this.channelManager.fetch(settings.channel) as TextChannel;
        } catch (err) {
            LogSettingsService.logger.log(`Unable to fetch channel "${settings.channel}": ${err}`);

            return;
        }

        this.cache.set(guild.id, settings);

        return settings;
    }

    async update(guild: Guild, channel: TextChannel): Promise<void> {
        const settings = this.cache.get(guild.id) ?? Object.assign(new LogSettings(), {guild: guild.id});
        this.cache.set(guild.id, settings);

        settings.channel = channel.id;
        settings.textChannel = channel;

        await this.logSettingsRepository.save(settings);
    }

    async delete(guild: Guild): Promise<void> {
        this.cache.delete(guild.id);

        await this.logSettingsRepository.delete(guild.id);
    }
}