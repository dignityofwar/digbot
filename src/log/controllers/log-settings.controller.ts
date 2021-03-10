import {Controller} from '@nestjs/common';
import {LogService} from '../log.service';
import {CommandRequest} from '../../commands/foundation/command.request';
import {Command} from '../../commands/foundation/decorators/command.decorator';

@Controller()
export class LogSettingsController {
    constructor(
        private readonly logService: LogService,
    ) {
    }

    @Command({
        adminOnly: true,
        command: '!log:channel',
        description: 'Set the current channel to be the log channel',
    })
    async channel({channel, guild}: CommandRequest) {
        await this.logService.setChannel(channel);

        await this.logService.log(
            'Logs',
            guild,
            'Updated log channel',
        );
    }
}
