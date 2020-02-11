/**
 * Exception can be thrown when a command does not exists
 */
export default class CommandNotFoundException extends Error {
    /**
     * Constructor for the CommandNotFoundException class
     *
     * @param {string} commandName the name of the command
     */
    public constructor(commandName: string) {
        super(
            `Command ${commandName} does not exist`,
        );

        this.name = 'CommandNotFoundException';
    }
}
