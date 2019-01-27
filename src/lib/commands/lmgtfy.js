const Command = require('../core/command');

module.exports = class StatsCommand extends Command {
    constructor() {
        super();

        this.name = 'lmgtfy';
    }

    /**
     * @param message
     * @return {Promise<void>}
     */
    async execute(message) {
        // TODO: Maybe incorporate some of the standard modules of node like querystring
        const args = message.cleanContent.split(' ');
        args.shift();

        return message.channel.send(
            args.length
                ? `There you go! http://lmgtfy.com/?q=${encodeURI(args.join('+'))}`
                : 'You still need to ask a question, I can\'t do that myself.',
        );
    }
};
