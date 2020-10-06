import { ModuleMetadata, Type } from '@nestjs/common';
import { DiscordModuleOptions } from './discordmodule.options';
import { DiscordOptionsFactory } from './discordoptions.factory';

export interface DiscordModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
    useExisting?: Type<DiscordOptionsFactory>;
    useClass?: Type<DiscordOptionsFactory>;
    useFactory?: (...args: any[]) => Promise<DiscordModuleOptions> | DiscordModuleOptions;
    inject?: any[];
}
