import {Controller, Logger} from '@nestjs/common';
import {Repository} from 'typeorm';
import {ReactionRole} from '../entities/reaction-role.entity';
import {InjectRepository} from '@nestjs/typeorm';
import {Command} from '../../commands/foundation/decorators/command.decorator';
import {CommandRequest} from '../../commands/foundation/command.request';
import {ChannelManager, MessageEmbed, TextChannel} from 'discord.js';
import {LogService} from '../../log/log.service';
import {DiscordClient} from '../../discord/foundation/discord.client';

@Controller()
export class ReactionRolesSettingsController {
    private static readonly logger = new Logger('ReactionRolesSettings');

    private readonly channelManager: ChannelManager;

    constructor(
        @InjectRepository(ReactionRole)
        private readonly roleRepository: Repository<ReactionRole>,
        private readonly logService: LogService,
        private readonly discordClient: DiscordClient,
    ) {
        this.channelManager = discordClient.channels;
    }

    @Command({
        adminOnly: true,
        command: '!rr:add',
        description: 'Add a new reaction role',
    })
    async add({args, member, message, channel, guild}: CommandRequest) {
        if (args.length < 4) {
            await channel.send(
                new MessageEmbed()
                    .setDescription('!rr:add [message id] [emoji] [role]'),
            );
            return;
        }

        const [, messageId, emoji, roleId] = args;
        const parsedRoleId = roleId.match(/[0-9]{5,}/);

        try {
            const reactionMessage = await channel.messages.fetch(messageId);
            const role = await guild.roles.fetch(parsedRoleId[0]);

            await reactionMessage.react(emoji);

            await this.roleRepository.save(
                this.roleRepository.create({
                    guildId: guild.id,
                    channelId: channel.id,
                    messageId: reactionMessage.id,
                    emoji: emoji,
                    roleId: role.id,
                }),
            );

            void message.delete();

            this.logService.log(
                'Reaction Roles',
                guild,
                `Created reaction role for "${role}" in ${channel} with ${emoji}`,
                member,
            );

        } catch (err) {
            await channel.send(
                new MessageEmbed()
                    .setDescription('Failed to create reaction role'),
            );

            ReactionRolesSettingsController.logger.warn(`Failed to create reaction role: ${err}`);
        }
    }

    @Command({
        adminOnly: true,
        command: '!rr:remove',
        description: 'Remove a reaction role',
    })
    async remove({args, member, message, channel, guild}: CommandRequest) {
        if (args.length < 4) {
            await channel.send(
                new MessageEmbed()
                    .setDescription('!rr:remove [message id] [emoji]'),
            );
            return;
        }

        const [, messageId, emoji] = args;

        const settings = await this.roleRepository.findOne({
            messageId: messageId,
            emoji: emoji,
        });

        if (!settings) {
            await channel.send(
                new MessageEmbed()
                    .setDescription('No reaction role found'),
            );
            return;
        }

        await this.roleRepository.remove(settings);

        try {
            const reactionChannel = await this.channelManager.fetch(settings.channelId) as TextChannel;
            const reactionMessage = await reactionChannel.messages.fetch(messageId);

            reactionMessage.reactions.resolve(settings.emoji)?.remove();
            message.delete();

        } catch (err) {
            ReactionRolesSettingsController.logger.warn(`Failed to remove reaction ${emoji} from message "${settings.messageId}" in "${settings.channelId}"`);

            await channel.send(
                new MessageEmbed()
                    .setDescription('Failed to remove the reaction from the message'),
            );
        }

        this.logService.log(
            'Reaction Roles',
            guild,
            `Removed reaction role in ${channel} with ${emoji}`,
            member,
        );

    }
}
