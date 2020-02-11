import { injectable, multiInject } from 'inversify';
import Command from './command';
import CommandNotFoundException from './exceptions/commandnotfoundexception';

@injectable()
export default class CommandRepository {
    private readonly commands: Map<string, Command> = new Map<string, Command>();

    public constructor(@multiInject(Command) commands: Command[]) {
        commands.forEach(command => this.commands.set(command.name.toUpperCase(), command));
    }

    public has(commamdName: string): boolean {
        return this.commands.has(commamdName.toUpperCase());
    }

    public get(commandName: string): Command {
        const command = this.commands.get(commandName.toUpperCase());

        if (command instanceof Command)
            return command;

        throw new CommandNotFoundException(commandName);
    }
}
