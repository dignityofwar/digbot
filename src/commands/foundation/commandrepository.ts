import { injectable, multiInject } from 'inversify';
import Command from './command';
import CommandNotFoundException from './exceptions/commandnotfoundexception';

/**
 * A repository which holds all registered commands
 */
@injectable()
export default class CommandRepository {
    /**
     * @type {Map<string, Command>} A map which maps commandNames to commands
     */
    private readonly commands: Map<string, Command> = new Map<string, Command>();

    /**
     * Constructor for the CommandRepository
     *
     * @param {Command[]} commands the commands that will be registered to the repository
     */
    public constructor(@multiInject(Command) commands: Command[]) {
        commands.forEach(command => this.commands.set(command.name.toUpperCase(), command));
    }

    /**
     * Checks if the command is in the repository
     *
     * @param {string} commamdName the name of the command to be checked for
     * @return {boolean} true if the command exists, false otherwise
     */
    public has(commamdName: string): boolean {
        return this.commands.has(commamdName.toUpperCase());
    }

    /**
     * Returns the command, throws an exception when none is exists
     *
     * @param {string} commandName the name of the command
     * @return {Command} the command belonging to the name
     */
    public get(commandName: string): Command {
        const command = this.commands.get(commandName.toUpperCase());

        if (command instanceof Command)
            return command;

        throw new CommandNotFoundException(commandName);
    }
}
