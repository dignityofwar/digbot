import {Controller} from '@nestjs/common';
import {Command} from './foundation/decorators/command.decorator';
import {GuildSettingsService} from './foundation/services/guild-settings.service';
import {CommandRequest} from './foundation/command.request';
import {LogService} from '../log/log.service';

@Controller()
export class CommandSettingsController {
    constructor(
        private readonly settingsService: GuildSettingsService,
        private readonly logService: LogService,
    ) {
    }

    @Command({
        adminOnly: true,
        command: '!commands:reset',
        description: 'Removes all whitelisted channels',
    })
    async reset({member, guild, message}: CommandRequest) {
        await this.settingsService.removeAllWhitelistedChannels(guild);

        void message.delete();

        this.logService.log(
            'Commands',
            guild,
            'All whitelisted command channels removed',
            member,
        );
    }

    @Command({
        adminOnly: true,
        command: '!commands:whitelist',
        description: 'Whitelist a channel to allow the use of commands',
    })
    async whitelist({member, channel, guild, message}: CommandRequest) {
        const result = await this.settingsService.toggleWhitelistedChannel(channel);

        void message.delete();

        this.logService.log(
            'Commands',
            guild,
            result
                ? `Channel "${channel.id}" whitelisted for commands`
                : `Channel "${channel.id}" removed from whitelist for commands`,
            member,
        );
    }
}
