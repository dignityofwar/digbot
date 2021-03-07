import {Controller} from '@nestjs/common';
import {Command} from './foundation/decorators/command.decorator';
import {GuildSettingsService} from './foundation/services/guild-settings.service';
import {CommandRequest} from './foundation/command.request';

@Controller()
export class CommandSettingsController {
    constructor(
        private readonly settingsService: GuildSettingsService,
    ) {
    }

    @Command({
        adminOnly: true,
        command: '!commands:reset',
        description: 'Removes all whitelisted channels',
    })
    async reset(request: CommandRequest) {
        await this.settingsService.removeAllWhitelistedChannels(request.guild);
    }

    @Command({
        adminOnly: true,
        command: '!commands:whitelist',
        description: 'Whitelist a channel to allow the use of commands',
    })
    async whitelist({channel, message}: CommandRequest) {
        const result = await this.settingsService.toggleWhitelistedChannel(channel);
        await message.react('👍');
    }

    // @Command({
    //     adminOnly: true,
    //     command: '!commands:channels',
    //     description: 'Returns a list of all whitelisted channels',
    // })
    // async channels(request: CommandRequest) {
    // }
}
