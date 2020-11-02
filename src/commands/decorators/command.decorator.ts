import { COMMAND_DECORATOR } from '../constants/command.constants';
import { CommandDecoratorOptions } from './interfaces/commanddecorator.options';

export function Command(options: CommandDecoratorOptions): MethodDecorator {
    return (target, propertyKey, descriptor) => {
        Reflect.defineMetadata(COMMAND_DECORATOR, options, target, propertyKey);
        return descriptor;
    };
}
