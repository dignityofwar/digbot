import {Controller, Logger} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {RoleMessenger} from '../entities/role-messenger.entity';
import {Repository} from 'typeorm';
import {Command} from '../../commands/foundation/decorators/command.decorator';
import {CommandRequest} from '../../commands/foundation/command.request';
import {ChannelManager, Guild, MessageEmbed, Role, TextChannel} from 'discord.js';
import {parseChannelArg, parseMentionArg} from '../../commands/foundation/utils/parse.helpers';
import {CommandException} from '../../commands/foundation/exceptions/command.exception';
import {LogService} from '../../log/log.service';


@Controller()
export class RoleSettingsController {
    private static readonly logger = new Logger('RoleSettingsController');

    private static readonly MAX_PREVIEW_LENGTH = 100;

    constructor(
        @InjectRepository(RoleMessenger)
        private readonly roleRepository: Repository<RoleMessenger>,
        private readonly logService: LogService,
        private readonly channelManager: ChannelManager,
    ) {
    }

    @Command({
        adminOnly: true,
        command: '!role:list',
        description: 'Get a list of all messages send on a role assignment',
    })
    async list({args, guild}: CommandRequest) {
        if (args.length < 2)
            return new MessageEmbed().setDescription('!roledm:set [role]');

        const [, roleArg] = args;

        const role = await this.fetchRole(guild, roleArg);

        const actions = await this.roleRepository.find({roleId: role.id});

        const reply = new MessageEmbed();

        if (!actions.length)
            return reply.setDescription('No messages found');

        reply.setDescription(`For ${role}`);

        for (const {channelId, message} of actions)
            reply.addField(
                channelId ? `<#${channelId}>` : 'dm',
                message.length > RoleSettingsController.MAX_PREVIEW_LENGTH
                    ? message.slice(0, RoleSettingsController.MAX_PREVIEW_LENGTH).trim() + '...'
                    : message,
            );

        return reply;
    }

    @Command({
        adminOnly: true,
        command: '!roledm:set',
        description: 'Set the dm message send when an role is assigned',
    })
    async setRoleDM({args, message, guild, member}: CommandRequest) {
        if (args.length < 2)
            return new MessageEmbed().setDescription('!roledm:set [role] [...message]');

        const [, roleArg] = args;

        const role = await this.fetchRole(guild, roleArg);


        const settings = await this.roleRepository.findOne({roleId: role.id, channelId: null})
            ?? this.roleRepository.create({
                guildId: guild.id,
                roleId: role.id,
            });

        settings.message = message.cleanContent.slice(
            message.cleanContent.indexOf(roleArg) + roleArg.length,
        ).trim();

        if (settings.message)
            throw new CommandException(new MessageEmbed().setDescription('No message provided'));

        await this.roleRepository.save(settings);

        this.logService.log(
            'Role Messenger',
            guild,
            `Updated dm message for ${role}`,
            member,
        );

        return new MessageEmbed().setDescription('Success').setColor('GREEN');
    }

    @Command({
        adminOnly: true,
        command: '!roledm:remove',
        description: 'Remove dm message for role',
    })
    async removeRoleDM({args, guild, member}: CommandRequest) {
        if (args.length < 2)
            return new MessageEmbed().setDescription('!roledm:remove [role]');

        const [, roleArg] = args;

        const role = await this.fetchRole(guild, roleArg);

        const result = await this.roleRepository.delete({roleId: role.id, channelId: null});

        if (!result.affected)
            return new MessageEmbed().setDescription('No role message found').setColor('GREEN');

        this.logService.log(
            'Role Messenger',
            guild,
            `Deleted dm message for ${role}`,
            member,
        );

        return new MessageEmbed().setDescription('Success').setColor('GREEN');
    }

    @Command({
        adminOnly: true,
        command: '!roletext:set',
        description: 'Set the message send when an role is assigned',
    })
    async setRole({args, message, guild, member}: CommandRequest) {
        if (args.length < 3)
            return new MessageEmbed().setDescription('!roletext:set [role] [channel] [...message]');

        const [, roleArg, channelArg] = args;

        const role = await this.fetchRole(guild, roleArg);
        const channel = await this.fetchChannel(guild, channelArg);


        const settings = await this.roleRepository.findOne({roleId: role.id, channelId: channel.id})
            ?? this.roleRepository.create({
                guildId: guild.id,
                roleId: role.id,
                channelId: channel.id,
            });

        settings.message = message.cleanContent.slice(
            message.cleanContent.indexOf(channelArg) + channelArg.length,
        ).trim();

        if (settings.message)
            throw new CommandException(new MessageEmbed().setDescription('No message provided'));

        await this.roleRepository.save(settings);

        this.logService.log(
            'Role Messenger',
            guild,
            `Updated text message for ${role} in ${channel}`,
            member,
        );

        return new MessageEmbed().setDescription('Success').setColor('GREEN');
    }

    @Command({
        adminOnly: true,
        command: '!roletext:remove',
        description: 'Remove message for role',
    })
    async removeRole({args, guild, member}: CommandRequest) {
        if (args.length < 3)
            return new MessageEmbed().setDescription('!roletext:remove [role] [channel]');

        const [, roleArg, channelArg] = args;

        const role = await this.fetchRole(guild, roleArg);
        const channel = await this.fetchChannel(guild, channelArg);


        const result = await this.roleRepository.delete({roleId: role.id, channelId: channel.id});

        if (!result.affected)
            return new MessageEmbed().setDescription('No role messages found').setColor('GREEN');

        this.logService.log(
            'Role Messenger',
            guild,
            `Deleted text message for ${role} in ${channel}`,
            member,
        );

        return new MessageEmbed().setDescription('Success').setColor('GREEN');

    }

    private async fetchRole(guild: Guild, arg: string): Promise<Role> {
        const roleId = parseMentionArg(arg);
        if (roleId)
            throw new CommandException(new MessageEmbed().setDescription('Unable to parse role'));

        return guild.roles.fetch(roleId)
            .catch((err) => {
                RoleSettingsController.logger.warn(`Unable to fetch role "${roleId}": ${err}`);
                throw new CommandException(new MessageEmbed().setDescription('Unable to find role'));
            });
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

            RoleSettingsController.logger.warn(`Unable to fetch channel "${channelId}": ${err}`);
            throw new CommandException(new MessageEmbed().setDescription('Unable to find channel'));
        }
    }
}