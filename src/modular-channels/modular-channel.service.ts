import {Injectable, Logger} from '@nestjs/common';
import {DiscordClient} from '../discord/discord.client';
import {MCSInitializeService} from './services/mcs-initialize.service';

@Injectable()
export class ModularChannelService {
    private static readonly logger = new Logger('ModularChannelSystem');

    constructor(
        discordClient: DiscordClient,
        private readonly initializeService: MCSInitializeService,
    ) {
        discordClient.once('ready', async () => {
            void this.initializeService.initService();
        });
    }
}
