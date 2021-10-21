import {Injectable, Type} from '@nestjs/common';
import {Reflector} from '@nestjs/core';
import {ON_DECORATOR} from './discord.constants';
import {DiscordEventOptions} from '../decorators/discord-event.decorator';

@Injectable()
export class MetadataAccessor {
    constructor(
        private readonly reflector: Reflector,
    ) {
    }

    getOnMetadata(target: Type<any> | Function): DiscordEventOptions | undefined {
        return this.reflector.get(ON_DECORATOR, target);
    }
}
