import {ON_DECORATOR} from '../discord.constants';
import {OnDecoratorOptions} from './interfaces/ondecorator.options';
import {SetMetadata} from '@nestjs/common';
import {ClientEvents} from '../types/client.events';

export function On(event: ClientEvents): MethodDecorator;
export function On(options: OnDecoratorOptions): MethodDecorator;
export function On(eventOrOptions: OnDecoratorOptions | ClientEvents): MethodDecorator {
    const options = typeof eventOrOptions == 'string'
        ? {event: eventOrOptions}
        : eventOrOptions;
    return SetMetadata(ON_DECORATOR, options ?? {});
}
