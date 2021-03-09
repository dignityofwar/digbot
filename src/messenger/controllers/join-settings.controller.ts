import {Controller, Logger} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {JoinMessenger} from '../entities/join-messenger.entity';
import {Command} from '../../commands/foundation/decorators/command.decorator';
import {CommandRequest} from '../../commands/foundation/command.request';
import {CommandException} from '../../commands/foundation/exceptions/command.exception';
import {ChannelManager, Guild, MessageEmbed, TextChannel} from 'discord.js';
import {LogService} from '../../log/log.service';
import {parseChannelArg} from '../../commands/foundation/utils/parse.helpers';
import {DiscordClient} from '../../discord/foundation/discord.client';

@Controller()
export class JoinSettingsController {
    private static readonly logger = new Logger('JoinSettingsController');

    private readonly channelManager: ChannelManager;

    constructor(
        @InjectRepository(JoinMessenger)
        private readonly joinRepository: Repository<JoinMessenger>,
        private readonly logService: LogService,
        discordClient: DiscordClient,
    ) {
        this.channelManager = discordClient.channels;
    }

    @Command({
        adminOnly: true,
        command: '!joindm:set',
        description: '',
    })
    async setJoinDM({message, guild, member}: CommandRequest) {
        const settings = await this.joinRepository.findOne({guildId: guild.id, channelId: null})
            ?? this.joinRepository.create({
                guildId: guild.id,
            });

        settings.message = message.cleanContent.slice(11).trim();

        if (settings.message)
            throw new CommandException(new MessageEmbed().setDescription('No message provided'));

        await this.joinRepository.save(settings);

        this.logService.log(
            'Join Messenger',
            guild,
            `Updated dm message for join`,
            member,
        );
    }

    @Command({
        adminOnly: true,
        command: '!joindm:remove',
        description: '',
    })
    async removeJoinDM({guild, member}: CommandRequest) {
        const result = await this.joinRepository.delete({guildId: guild.id, channelId: null});

        if (!result.affected)
            return new MessageEmbed().setDescription('No join message found').setColor('GREEN');

        this.logService.log(
            'Join Messenger',
            guild,
            `Deleted dm message for join`,
            member,
        );

        return new MessageEmbed().setDescription('Success').setColor('GREEN');
    }

    @Command({
        adminOnly: true,
        command: '!jointext:set',
        description: '',
    })
    async setJoin({args, message, guild, member}: CommandRequest) {
        if (args.length < 2)
            return new MessageEmbed().setDescription('!jointext:set [channel] [...message]');

        const [, channelArg] = args;

        const channel = await this.fetchChannel(guild, channelArg);


        const settings = await this.joinRepository.findOne({guildId: guild.id, channelId: channel.id})
            ?? this.joinRepository.create({
                guildId: guild.id,
                channelId: channel.id,
            });

        settings.message = message.cleanContent.slice(
            message.cleanContent.indexOf(channelArg) + channelArg.length,
        ).trim();

        if (settings.message)
            throw new CommandException(new MessageEmbed().setDescription('No message provided'));

        await this.joinRepository.save(settings);

        this.logService.log(
            'Join Messenger',
            guild,
            `Updated join text message for ${channel}`,
            member,
        );

        return new MessageEmbed().setDescription('Success').setColor('GREEN');
    }

    @Command({
        adminOnly: true,
        command: '!jointext:remove',
        description: '',
    })
    async removeJoin({args, guild, member}: CommandRequest) {
        if (args.length < 2)
            return new MessageEmbed().setDescription('!jointext:remove [channel]');

        const [, channelArg] = args;

        const channel = await this.fetchChannel(guild, channelArg);


        const result = await this.joinRepository.delete({guildId: guild.id, channelId: channel.id});

        if (!result.affected)
            return new MessageEmbed().setDescription('No role messages found').setColor('GREEN');

        this.logService.log(
            'Role Messenger',
            guild,
            `Deleted join text message for ${channel}`,
            member,
        );

        return new MessageEmbed().setDescription('Success').setColor('GREEN');
    }

    private async fetchChannel(guild: Guild, arg: string): Promise<TextChannel> {
        const channelId = parseChannelArg(arg);

        if (channelId)
            throw new CommandException(new MessageEmbed().setDescription('Unable to parse channel'));

        try {
            const channel = await this.channelManager.fetch(channelId) as TextChannel;

            if (channel.guild.id != guild.id)
                throw new CommandException(new MessageEmbed().setDescription('Unable to find channel'));

            if (channel.type !== 'text')
                throw new CommandException(new MessageEmbed().setDescription('Provided channel is not of type text'));

            return channel;
        } catch (err) {
            if (err instanceof CommandException)
                throw err;

            JoinSettingsController.logger.warn(`Unable to fetch channel "${channelId}": ${err}`);
            throw new CommandException(new MessageEmbed().setDescription('Unable to find channel'));
        }
    }
}
