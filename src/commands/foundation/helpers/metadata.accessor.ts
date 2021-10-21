import {Injectable, Type} from '@nestjs/common';
import {Reflector} from '@nestjs/core';
import {COMMAND_DECORATOR} from './command.constants';
import {DiscordCommandOptions} from '../decorators/discord-command.decorator';

@Injectable()
export class MetadataAccessor {
    constructor(
        private readonly reflector: Reflector,
    ) {
    }

    getCommandMetadata(target: Type<any> | Function): DiscordCommandOptions | undefined {
        return this.reflector.get(COMMAND_DECORATOR, target);
    }
}
