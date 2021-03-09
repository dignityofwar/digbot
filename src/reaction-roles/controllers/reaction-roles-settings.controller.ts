import {Controller, Logger} from '@nestjs/common';
import {Repository} from 'typeorm';
import {ReactionRole} from '../entities/reaction-role.entity';
import {InjectRepository} from '@nestjs/typeorm';
import {Command} from '../../commands/foundation/decorators/command.decorator';
import {CommandRequest} from '../../commands/foundation/command.request';
import {ChannelManager, Guild, Message, MessageEmbed, Role, TextChannel} from 'discord.js';
import {LogService} from '../../log/log.service';
import {DiscordClient} from '../../discord/foundation/discord.client';
import {CommandException} from '../../commands/foundation/exceptions/command.exception';
import {parseMentionArg} from '../../commands/foundation/utils/parse.helpers';
import {channel, role} from '../../utils/discord.utils';

@Controller()
export class ReactionRolesSettingsController {
    private static readonly logger = new Logger('ReactionRolesSettings');

    private readonly channelManager: ChannelManager;

    constructor(
        @InjectRepository(ReactionRole)
        private readonly roleRepository: Repository<ReactionRole>,
        private readonly logService: LogService,
        discordClient: DiscordClient,
    ) {
        this.channelManager = discordClient.channels;
    }

    @Command({
        adminOnly: true,
        command: '!rr:list',
        description: 'List all reaction roles',
    })
    async list({guild}: CommandRequest) {
        const rrs = await this.roleRepository.find({guildId: guild.id});

        if (!rrs.length)
            return new MessageEmbed().setDescription('No reaction roles found');

        return new MessageEmbed({
            fields: rrs.map((rr) => ({
                name: `${channel(rr.channelId)} ${rr.emoji}`,
                value: role(rr.roleId),
            })),
        });
    }

    @Command({
        adminOnly: true,
        command: '!rr:add',
        description: 'Add a new reaction role',
    })
    async add({args, member, message, channel, guild}: CommandRequest) {
        if (args.length < 4)
            return new MessageEmbed()
                .setDescription('!rr:add [message id] [emoji] [role]');

        const [, messageId, emoji, roleArg] = args;

        const reactionMessage = await this.fetchMessage(channel, messageId);
        const role = await this.fetchRole(guild, roleArg);

        if (await this.roleRepository.count({messageId: message.id, emoji}) > 0)
            throw new CommandException(new MessageEmbed().setDescription('Message emoji combination already in use'));

        await reactionMessage.react(emoji)
            .catch((err) => {
                ReactionRolesSettingsController.logger.warn(`Unable to react to "${messageId}" with "${emoji}": ${err}`);
                throw new CommandException(new MessageEmbed().setDescription('Unable to add emoji'));
            });

        await this.roleRepository.save(
            this.roleRepository.create({
                guildId: guild.id,
                channelId: channel.id,
                messageId: reactionMessage.id,
                emoji: emoji,
                roleId: role.id,
            }),
        );

        this.logService.log(
            'Reaction Roles',
            guild,
            `Created reaction role for ${role} in ${channel} with ${emoji}`,
            member,
        );

        return new MessageEmbed().setDescription('Success').setColor('GREEN');
    }

    @Command({
        adminOnly: true,
        command: '!rr:remove',
        description: 'Remove a reaction role',
    })
    async remove({args, member, channel, guild}: CommandRequest) {
        if (args.length < 3)
            return new MessageEmbed()
                .setDescription('!rr:remove [message id] [emoji]');

        const [, messageId, emoji] = args;

        const settings = await this.roleRepository.findOne({
            messageId: messageId,
            emoji: emoji,
        });
        if (!settings) return;

        await this.roleRepository.remove(settings);

        this.logService.log(
            'Reaction Roles',
            guild,
            `Removed reaction role in ${channel} with ${emoji}`,
            member,
        );

        try {
            const reactionChannel = await this.channelManager.fetch(settings.channelId) as TextChannel;
            const reactionMessage = await reactionChannel.messages.fetch(messageId);

            reactionMessage.reactions.resolve(settings.emoji)?.remove();
        } catch (err) {
            ReactionRolesSettingsController.logger.warn(`Failed to remove reaction ${emoji} from message "${settings.messageId}" in "${settings.channelId}"`);

            throw new CommandException(new MessageEmbed().setDescription('Reaction role removed, but unable to remove emoji from message'));
        }

        return new MessageEmbed().setDescription('Success').setColor('GREEN');
    }

    private async fetchRole(guild: Guild, arg: string): Promise<Role> {
        const roleId = parseMentionArg(arg);
        if (roleId)
            throw new CommandException(new MessageEmbed().setDescription('Unable to parse role'));

        return await guild.roles.fetch(roleId)
            .catch((err) => {
                ReactionRolesSettingsController.logger.warn(`Unable to fetch role "${roleId}": ${err}`);
                throw new CommandException(new MessageEmbed().setDescription('Unable to find role'));
            });
    }

    private fetchMessage(channel: TextChannel, messageId: string): Promise<Message> {
        return channel.messages.fetch(messageId)
            .catch((err) => {
                ReactionRolesSettingsController.logger.warn(`Unable to fetch message "${messageId}": ${err}`);
                throw new CommandException(new MessageEmbed().setDescription('Unable to find message'));
            });
    }
}
