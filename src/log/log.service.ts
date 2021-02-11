import {Injectable, Logger} from '@nestjs/common';
import {LogSettingsService} from './services/log-settings.service';
import {Guild, MessageEmbed} from 'discord.js';

@Injectable()
export class LogService {
    private static readonly logger = new Logger('LogSettingsService');

    constructor(
        private readonly logSettingsService: LogSettingsService,
    ) {
    }

    log(guild: Guild, message: string, label: string): void {
        this.logSettingsService.get(guild)
            .then((settings) => {
                settings?.textChannel.send(
                    new MessageEmbed()
                        .setDescription(message)
                        .setFooter(label),
                )
                    .catch((err) =>
                        LogService.logger.warn(`Failed to send log to guild "${guild.id}": ${err}`))
            })
    }
}
