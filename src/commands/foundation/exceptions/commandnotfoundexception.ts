export default class CommandNotFoundException extends Error {
    public constructor(commandName: string) {
        super(
            `Command ${commandName} does not exist`,
        );

        this.name = 'CommandNotFoundException';
    }
}
