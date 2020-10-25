import { Client } from 'discord.js';
import { OnApplicationBootstrap, OnApplicationShutdown } from '@nestjs/common';
import { DiscordModuleOptions } from './interfaces/discordmodule.options';

export class DiscordClient extends Client implements OnApplicationBootstrap, OnApplicationShutdown {
    constructor(options: DiscordModuleOptions) {
        super(options);

        this.token = options.token;
    }

    async onApplicationBootstrap(): Promise<void> {
        await this.login();
    }

    onApplicationShutdown(): void {
        this.destroy();
    }
}
