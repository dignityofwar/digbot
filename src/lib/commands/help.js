const { words } = require('lodash');
const Command = require('../core/command');

module.exports = class HelpCommand extends Command {
    constructor({ commandRegister }) {
        super();

        this.name = 'help';

        this.throttle = {
            attempts: 2,
            decay: 10,
        };

        this.register = commandRegister;
    }

    /**
     * @param message
     * @return {Promise<void>}
     */
    async execute(message) {
        if (this.wantsFull(message.cleanContent)) {
            return message.member.send(this.createDM());
        }

        // const commandMessage = this.wantsSomething(message.cleanContent);
        //
        // if (commandMessage) {
        //     return message.channel.send(commandMessage);
        // }

        return message.channel.send(this.createReply());
    }

    /**
     * @param content
     * @return {boolean}
     */
    wantsFull(content) {
        return (words(content)[1] || '').toUpperCase() === 'FULL';
    }

    /**
     * @param content
     */
    // wantsSomething(content) {
    //     return get(details, (words(content)[1] || '').toUpperCase(), false);
    // }

    /**
     * @return {string}
     */
    createReply() {
        return this.register.commands.filter(({ onlyHelpFull, special }) => !onlyHelpFull && !special)
            .reduce(
                (message, { name, help }) => `${message}\n**!${name}**: ${help(false)}`,
                '__Core Commands__',
            );
    }

    /**
     * @return {string}
     */
    createDM() {
        return this.register.commands.filter(({ special }) => !special)
            .reduce(
                (message, { name, help }) => `${message}\n**!${name}**: ${help(true)}`,
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
