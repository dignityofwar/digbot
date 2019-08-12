const { RichEmbed } = require('discord.js');
const Command = require('./foundation/command');

module.exports = class HelpCommand extends Command {
    constructor({ commandRegister }) {
        super();

        this.name = 'help';

        this.throttle = {
            attempts: 1,
            decay: 30,
            peruser: false,
        };

        this.register = commandRegister;
    }

    /**
     * @param request
     * @return {Promise<void>}
     */
    async execute(request) {
        return request.respond(this.createReply());
    }

    /**
     * @return {string}
     */
    createReply() {
        const embed = new RichEmbed().setTitle('Commands');

        this.register.toArray().filter(({ special }) => !special).forEach(c => embed.addField(`!${c.name}`, c.help()));

        return embed;
    }

    /**
     * @return {string}
     */
    help() {
        return 'Will give a more detailed explanation of the command.';
    }
};
