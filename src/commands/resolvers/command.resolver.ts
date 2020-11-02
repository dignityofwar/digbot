import { CommandResolver as ICommandResolver } from '../interfaces/command.resolver';
import { CommandDecoratorOptions } from '../decorators/interfaces/commanddecorator.options';
import { COMMAND_DECORATOR } from '../constants/command.constants';
import { CommandRepository } from '../command.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CommandResolver implements ICommandResolver {
    constructor(
        private readonly repository: CommandRepository,
    ) {}

    public resolve(instance: Record<string, any>, methodName: string): void {
        const metadata: CommandDecoratorOptions = Reflect.getMetadata(COMMAND_DECORATOR, instance, methodName);

        if (metadata) {
            this.repository.register(metadata, instance[methodName].bind(instance));
        }
    }
}
