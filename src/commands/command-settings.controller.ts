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
    async reset({member, guild}: CommandRequest) {
        await this.settingsService.removeAllWhitelistedChannels(guild);

        this.logService.log(
            'Commands',
            guild,
            `All whitelisted command channels removed by ${member.displayName}(${member.id})`,
        );
    }

    @Command({
        adminOnly: true,
        command: '!commands:whitelist',
        description: 'Whitelist a channel to allow the use of commands',
    })
    async whitelist({member, channel, guild, message}: CommandRequest) {
        const result = await this.settingsService.toggleWhitelistedChannel(channel);

        message.delete();

        this.logService.log(
            'Commands',
            guild,
            result
                ? `Channel "${channel.id}" whitelisted for commands by ${member.displayName}(${member.id})`
                : `Channel "${channel.id}" removed from whitelist for commands by ${member.displayName}(${member.id})`,
        );
    }

    // @Command({
    //     adminOnly: true,
    //     command: '!commands:channels',
    //     description: 'Returns a list of all whitelisted channels',
    // })
    // async channels(request: CommandRequest) {
    // }
}
