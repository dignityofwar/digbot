import {ON_DECORATOR} from '../helpers/discord.constants';
import {SetMetadata} from '@nestjs/common';
import {ClientEvents} from '../types/client.events';

export interface DiscordEventOptions {
    event: ClientEvents;
}

export function DiscordEvent(event: ClientEvents): MethodDecorator;
export function DiscordEvent(options: DiscordEventOptions): MethodDecorator;
export function DiscordEvent(eventOrOptions: DiscordEventOptions | ClientEvents): MethodDecorator {
    const options = typeof eventOrOptions == 'string'
        ? {event: eventOrOptions}
        : eventOrOptions;
    return SetMetadata(ON_DECORATOR, options ?? {});
}
