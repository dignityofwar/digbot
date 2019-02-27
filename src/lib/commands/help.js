const Command = require('./foundation/command');

module.exports = class HelpCommand extends Command {
    constructor({ commandRegister }) {
        super();

        this.name = 'help';

        this.throttle = {
            attempts: 1,
            decay: 30,
        };

        this.register = commandRegister;
    }

    /**
     * @param message
     * @return {Promise<void>}
     */
    async execute(message) {
        // const commandMessage = this.wantsSomething(message.cleanContent);
        //
        // if (commandMessage) {
        //     return message.channel.send(commandMessage);
        // }

        return message.channel.send(this.createReply());
    }

    // /**
    //  * @param content
    //  */
    // wantsSomething(content) {
    //     return ;
    // }

    /**
     * @return {string}
     */
    createReply() {
        return this.register.commands.filter(({ special }) => !special)
            .reduce(
                (message, { name, help }) => `${message}\n**!${name}**: ${help(false)}`,
                '__Core Commands__',
            );
    }

    /**
     * @return {string}
     */
    help() {
        return 'Will give a more detailed explanation of the command.';
    }
};
