import {Injectable} from '@nestjs/common';
import {commandHandler} from '../types/command.handler';
import {DiscordCommandOptions} from '../decorators/discord-command.decorator';

export interface Command extends DiscordCommandOptions {
    handler: commandHandler;
}

@Injectable()
export class CommandContainer {
    private readonly commands = new Map<string, Command>();

    register(options: DiscordCommandOptions, handler: commandHandler): void {
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
