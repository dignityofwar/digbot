const Command = require('../core/command');

module.exports = class LmgtfyCommand extends Command {
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

    /**
     * @param {boolean} full
     * @return {string}
     */
    help(full) {
        return !full
            ? 'Someone being lazy and not using Google? Generate them a link to use!'
            : 'Generates a link to http://lmgtfy.com (short for Let Me Google That For You) '
            + 'which you can use when people are being lazy and not Googling things.';
    }
};
