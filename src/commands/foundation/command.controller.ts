import {Controller} from '@nestjs/common';
import {GuildMember, Message, Permissions, TextChannel} from 'discord.js';
import {On} from '../../discord/foundation/decorators/on.decorator';
import {CommandContainer} from './command.container';
import {ArgumentLexer} from './helpers/argument.lexer';
import {GuildSettingsService} from './services/guild-settings.service';
import {CommandRequest} from './command.request';

@Controller()
export class CommandController {
    constructor(
        private readonly repository: CommandContainer,
        private readonly settingsService: GuildSettingsService,
    ) {
    }

    @On('message')
    async message(message: Message) {
        if (message.author.bot || message.channel.type !== 'text') return;

        const lexer = new ArgumentLexer(message.cleanContent);
        const commandName = lexer.next();
        const command = this.repository.get(commandName);

        if (command) {
            const isAdmin = this.hasAdminPermissions(message.member);

            if (command.adminOnly && !isAdmin) return; // Check permissions
            if (!isAdmin && !await this.isCommandChannel(message.channel)) return; // Check channel

            command.handler(new CommandRequest(message, lexer.all()));
        }
    }

    private hasAdminPermissions(member: GuildMember): boolean {
        return member.hasPermission(Permissions.FLAGS.ADMINISTRATOR);
    }

    private async isCommandChannel(channel: TextChannel): Promise<boolean> {
        return this.settingsService.isWhitelisted(channel);
    }
}
