import {COMMAND_DECORATOR} from '../command.constants';
import {CommandDecoratorOptions} from './interfaces/commanddecorator.options';
import {SetMetadata} from '@nestjs/common';

export function Command(command: string): MethodDecorator;
export function Command(options: CommandDecoratorOptions): MethodDecorator;
export function Command(commandOrOptions: CommandDecoratorOptions | string): MethodDecorator {
    const options = typeof commandOrOptions == 'string'
        ? {command: commandOrOptions}
        : commandOrOptions;
    return SetMetadata(COMMAND_DECORATOR, options);
}
