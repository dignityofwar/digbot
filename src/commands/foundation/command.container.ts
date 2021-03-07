import {Injectable} from '@nestjs/common';
import {CommandDecoratorOptions} from './decorators/interfaces/commanddecorator.options';
import {commandHandler} from './interfaces/command.handler';

export interface Command extends CommandDecoratorOptions {
    handler: commandHandler;
}

@Injectable()
export class CommandContainer {
    private readonly commands = new Map<string, Command>();

    register(options: CommandDecoratorOptions, handler: commandHandler): void {
        if (this.commands.has(options.command))
            throw new Error(`Command ${options.command} is already registered`);

        this.commands.set(options.command, {
            ...options,
            handler,
        });
    }

    get(command: string): Command | undefined {
        return this.commands.get(command);
    }

    all(): Command[] {
        return Array.from(this.commands.values());
    }
}
