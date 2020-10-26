import { Client } from 'discord.js';
import { Logger, OnApplicationBootstrap, OnApplicationShutdown } from '@nestjs/common';
import { DiscordModuleOptions } from './interfaces/discordmodule.options';

export class DiscordClient extends Client implements OnApplicationBootstrap, OnApplicationShutdown {
    private static logger = new Logger('DiscordClient');

    constructor(options: DiscordModuleOptions) {
        super(options);

        this.token = options.token;

        // TODO: Add listeners
    }

    async onApplicationBootstrap(): Promise<void> {
        await this.login();

        DiscordClient.logger.log('Connected')
    }

    onApplicationShutdown(): void {
        this.destroy();

        DiscordClient.logger.log('Disconnected')
    }
}
