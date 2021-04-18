import {Controller, Logger} from '@nestjs/common';
import {Command} from './foundation/decorators/command.decorator';
import {GuildSettingsService} from './foundation/services/guild-settings.service';
import {CommandRequest} from './foundation/command.request';
import {LogService} from '../log/log.service';
import {ChannelManager, Guild, MessageEmbed, Role, TextChannel} from 'discord.js';
import {parseChannelArg, parseMentionArg} from './foundation/utils/parse.helpers';
import {CommandException} from './foundation/exceptions/command.exception';

@Controller()
export class CommandSettingsController {
    private static readonly logger = new Logger('CommandSettingsController');

    constructor(
        private readonly settingsService: GuildSettingsService,
        private readonly logService: LogService,
        private readonly channelManager: ChannelManager,
    ) {
    }

    @Command({
        adminOnly: true,
        command: '!commands:list',
        description: 'List all whitelisted channels',
    })
    async list({guild}: CommandRequest) {
        const whitelisted = await this.settingsService.getAllWhitelistedChannels(guild);

        if (!whitelisted.length)
            return new MessageEmbed().setDescription('No whitelisted channels');

        return new MessageEmbed().setDescription(
            whitelisted.map((channel) => `- <#${channel.channelId}>`)
                .join('\n'),
        );
    }

    @Command({
        adminOnly: true,
        command: '!commands:reset',
        description: 'Removes all whitelisted channels',
    })
    async reset({member, guild}: CommandRequest) {
        await this.settingsService.removeAllWhitelistedChannels(guild);

        this.logService.log(
            'Commands',
            guild,
            'All whitelisted command channels removed',
            member,
        );

        return new MessageEmbed().setDescription('Success').setColor('GREEN');
    }

    @Command({
        adminOnly: true,
        command: '!commands:whitelist',
        description: 'Whitelist a channel to allow the use of commands',
    })
    async whitelist({args, member, channel, guild}: CommandRequest) {
        const [, channelArg] = args;

        const whitelisted = channelArg ? await this.fetchChannel(guild, channelArg) : channel;

        const result = await this.settingsService.toggleWhitelistedChannel(whitelisted);

        this.logService.log(
            'Commands',
            guild,
            result
                ? `Channel ${whitelisted} whitelisted for commands`
                : `Channel ${whitelisted} removed from whitelist for commands`,
            member,
        );

        if (result)
            return new MessageEmbed().setDescription('Channel whitelisted');
        else
            return new MessageEmbed().setDescription('Channel removed from whitelist');
    }

    @Command({
        adminOnly: true,
        command: '!commands:role',
        description: 'Make role admin, or remove admin status',
    })
    async toggleRole({args, guild}: CommandRequest) {
        const [, roleArg] = args;

        const role = await this.fetchRole(guild, roleArg);

        if (await this.settingsService.toggleAdminRole(role))
            return new MessageEmbed().setDescription('Role gained admin status');
        else
            return new MessageEmbed().setDescription('Role lost admin status');
    }

    private async fetchRole(guild: Guild, arg: string): Promise<Role> {
        const roleId = parseMentionArg(arg);
        if (roleId)
            throw new CommandException(new MessageEmbed().setDescription('Unable to parse role'));

        return guild.roles.fetch(roleId)
            .catch((err) => {
                CommandSettingsController.logger.warn(`Unable to fetch role "${roleId}": ${err}`);
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

            CommandSettingsController.logger.warn(`Unable to fetch channel "${channelId}": ${err}`);
            throw new CommandException(new MessageEmbed().setDescription('Unable to find channel'));
        }
    }
}
