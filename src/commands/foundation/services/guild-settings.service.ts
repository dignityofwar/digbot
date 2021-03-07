import {Injectable} from '@nestjs/common';
import {Repository} from 'typeorm';
import {InjectRepository} from '@nestjs/typeorm';
import {WhitelistedChannel} from '../entities/whitelisted-channel.entity';
import {Guild, TextChannel} from 'discord.js';

@Injectable()
export class GuildSettingsService {
    constructor(
        @InjectRepository(WhitelistedChannel)
        private readonly channelRepository: Repository<WhitelistedChannel>,
    ) {
    }

    async removeAllWhitelistedChannels(guild: Guild): Promise<void> {
        await this.channelRepository.delete({guildId: guild.id});
    }

    async toggleWhitelistedChannel(channel: TextChannel): Promise<boolean> {
        const whitelisted = await this.channelRepository.findOne({channelId: channel.id});

        if (whitelisted) {
            await this.channelRepository.remove(whitelisted);

            return false;
        }

        await this.channelRepository.save(
            this.channelRepository.create({
                guildId: channel.guild.id,
                channelId: channel.id,
            }),
        );

        return true;
    }

    async isWhitelisted(channel: TextChannel): Promise<boolean> {
        return await this.channelRepository.count({channelId: channel.id}) > 0;
    }
}
