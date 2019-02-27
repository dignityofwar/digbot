const Command = require('./foundation/command');

module.exports = class AdminCommand extends Command {
    constructor({ commandRegister }) {
        super();

        this.name = 'admin';
        this.special = true;

        this.register = commandRegister;
    }

    /**
     * @param message
     * @return {Promise<void>}
     */
    async execute(message) {
        return Promise.all([
            message.member.send(this.createReply()),
            message.channel.send(`I'll PM you the list of admin commands ${message.member.displayName}`),
        ]);
    }

    /**
     * @return {string}
     */
    /**
     * @return {string}
     */
    createReply() {
        return this.register.commands.filter(({ special }) => special)
            .reduce(
                (message, { name, help }) => `${message}\n**!${name}**: ${help(false)}`,
                '__Admin Commands__',
            );
    }

    /**
     * @return {string}
     */
    help() {
        return 'Lists all admin commands';
    }
};
