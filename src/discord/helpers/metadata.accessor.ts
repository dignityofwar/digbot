import { Injectable, Type } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { OnDecoratorOptions } from '../decorators/interfaces/ondecorator.options';
import { ON_DECORATOR } from '../constants/discord.constants';

/* eslint-disable @typescript-eslint/ban-types */

@Injectable()
export class MetadataAccessor {
    constructor(
        private readonly reflector: Reflector,
    ) {}

    getOnMetadata(target: Type<any> | Function): OnDecoratorOptions | undefined {
        return this.reflector.get(ON_DECORATOR, target);
    }
}
