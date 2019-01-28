const Command = require('../core/command');

// const messages = [
//     '__Admin Commands__:',
//     '**!roles**: PM a list of all roles and their associated IDs',
//     '**!positions**: PM a list of all channels and their associated position variables',
//     '**!sort**: Manually trigger a global sort of all channels (Should run automatically when necesary)',
// ];

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
