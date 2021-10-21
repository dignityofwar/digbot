import {COMMAND_DECORATOR} from '../helpers/command.constants';
import {SetMetadata} from '@nestjs/common';

export interface DiscordCommandOptions {
    command: string;
    description: string;
}

export function DiscordCommand(command: string): MethodDecorator;
export function DiscordCommand(options: DiscordCommandOptions): MethodDecorator;
export function DiscordCommand(commandOrOptions: DiscordCommandOptions | string): MethodDecorator {
    const options = typeof commandOrOptions == 'string'
        ? {command: commandOrOptions}
        : commandOrOptions;
    return SetMetadata(COMMAND_DECORATOR, options);
}
