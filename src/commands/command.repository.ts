import { Injectable } from '@nestjs/common';
import { CommandDecoratorOptions } from './decorators/interfaces/commanddecorator.options';
import { commandHandler } from './interfaces/command.handler';

@Injectable()
export class CommandRepository {
    private readonly commands = new Map<string, commandHandler>();

    register(options: CommandDecoratorOptions, handler: commandHandler): void {
        if (this.commands.has(options.command))
            throw new Error(`Command ${options.command} is already registered`);

        this.commands.set(options.command, handler);

        if (options.alias) {
            if (this.commands.has(options.alias))
                throw new Error(`Command ${options.command} cannot be registered with the alias ${options.alias}`);

            this.commands.set(options.alias, handler);
        }
    }

    get(command: string): commandHandler | null {
        return this.commands.get(command) ?? null;
    }
}
