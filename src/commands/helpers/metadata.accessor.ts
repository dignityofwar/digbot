import { Injectable, Type } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CommandDecoratorOptions } from '../decorators/interfaces/commanddecorator.options';
import { COMMAND_DECORATOR } from '../command.constants';

@Injectable()
export class MetadataAccessor {
    constructor(
        private readonly reflector: Reflector,
    ) {}

    getCommandMetadata(target: Type<any> | Function): CommandDecoratorOptions | undefined {
        return this.reflector.get(COMMAND_DECORATOR, target);
    }
}
