import { ON_DECORATOR } from '../discord.constants';
import { OnDecoratorOptions } from './interfaces/ondecorator.options';
import { ClientEvents } from 'discord.js';
import { isString } from 'util';
import { SetMetadata } from '@nestjs/common';

export function On(event: keyof ClientEvents): MethodDecorator;
export function On(options: OnDecoratorOptions): MethodDecorator;
export function On(eventOrOptions: OnDecoratorOptions | keyof ClientEvents): MethodDecorator {
    const options = isString(eventOrOptions)
        ? {event: eventOrOptions}
        : eventOrOptions;
    return SetMetadata(ON_DECORATOR, options ?? {});
}
