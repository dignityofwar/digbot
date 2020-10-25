import { ON_DECORATOR } from '../constants/Discord.constants';
import { OnDecoratorOptions } from './interfaces/ondecorator.options';
import { ClientEvents } from 'discord.js';

export function On(options: OnDecoratorOptions | keyof ClientEvents): MethodDecorator {
    return (target, propertyKey, descriptor) => {
        Reflect.defineMetadata(ON_DECORATOR, options, target, propertyKey);
        return descriptor;
    };
}
