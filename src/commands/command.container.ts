import { Injectable } from '@nestjs/common';
import { CommandDecoratorOptions } from './decorators/interfaces/commanddecorator.options';
import { commandHandler } from './interfaces/command.handler';

export interface Command extends CommandDecoratorOptions {
    handler: commandHandler;
}

@Injectable()
export class CommandContainer {
    private readonly commands = new Map<string, Command>();

    register(options: CommandDecoratorOptions, handler: commandHandler): void {
        const command = {
            ...options,
            handler,
        };

        if (this.commands.has(options.command))
            throw new Error(`Command ${options.command} is already registered`);

        this.commands.set(options.command, command);

        if (options.alias) {
            if (this.commands.has(options.alias))
                throw new Error(`Command ${options.command} cannot be registered with the alias ${options.alias}`);

            this.commands.set(options.alias, command);
        }
    }

    get(command: string): commandHandler {
        return this.commands.get(command)?.handler;
    }

    all(): Command[] {
        return Array.from(this.commands.values());
    }
}
