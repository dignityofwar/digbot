import { DynamicModule, Module, Provider } from '@nestjs/common';
import { DiscoveryModule } from '@nestjs/core';
import { DiscordClient } from './discord.client';
import { DiscordModuleOptions } from './interfaces/discordmodule.options';
import { DiscordModuleAsyncOptions } from './interfaces/discordmoduleasync.options';
import { DISCORD_MODULE_OPTIONS } from './constants/discord.constants';
import { DiscordOptionsFactory } from './interfaces/discordoptions.factory';
import { DiscordExplorer } from './discord.explorer';
import { MetadataAccessor } from './helpers/metadata.accessor';

@Module({
    imports: [DiscoveryModule],
})
export class DiscordModule {
    static forRoot(options: DiscordModuleOptions): DynamicModule {
        return {
            module: DiscordModule,
            providers: [
                MetadataAccessor,
                DiscordExplorer,
                {
                    provide: DISCORD_MODULE_OPTIONS,
                    useValue: options ?? {},
                }, {
                    provide: DiscordClient,
                    useValue: new DiscordClient(options),
                },
            ],
            exports: [
                DiscordClient,
            ],
        };
    }

    static forRootAsync(options: DiscordModuleAsyncOptions): DynamicModule {
        return {
            module: DiscordModule,
            imports: options.imports ?? [],
            providers: [
                MetadataAccessor,
                DiscordExplorer,
                DiscordModule.createDiscordOptionsProvider(options),
                {
                    provide: DiscordClient,
                    useFactory: (options: DiscordModuleOptions) => new DiscordClient(options),
                    inject: [DISCORD_MODULE_OPTIONS],
                },
            ],
            exports: [
                DiscordClient,
            ],
        };
    }

    private static createDiscordOptionsProvider(options: DiscordModuleAsyncOptions): Provider {
        if (options) {
            if (options.useFactory) {
                return {
                    provide: DISCORD_MODULE_OPTIONS,
                    useFactory: options.useFactory,
                    inject: options.inject ?? [],
                };
            }

            return {
                provide: DISCORD_MODULE_OPTIONS,
                useFactory: async (factory: DiscordOptionsFactory): Promise<DiscordModuleOptions> =>
                    await factory.createDiscordOptions(),
                inject: [options.useExisting ?? options.useClass],
            };
        }

        return {
            provide: DISCORD_MODULE_OPTIONS,
            useValue: {},
        };
    }
}
