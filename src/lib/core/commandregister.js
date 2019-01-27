// TODO: Maybe make this extend an Map or Array?
module.exports = class CommandRegistery {
    constructor({ container }) {
        // TODO: Should not depend on the container, LoadModules bootstrapper should be used first
        this.container = container;

        this.commands = [];
    }

    /**
     *
     * @param command
     */
    add(command) {
        this.commands.push(command);
    }
};
