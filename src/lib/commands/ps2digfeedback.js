const Command = require('../core/command');

module.exports = class Ps2digfeedbackCommand extends Command {
    constructor() {
        super();

        this.name = 'ps2digfeedback';
    }

    /**
     * @param message
     * @return {Promise<void>}
     */
    async execute(message) {
        return message.channel.send('@here Please post your PS2 Platoon feedback at this form: '
            + 'http://bit.ly/DIGPLFeedback. Note, your feedback **can** be anonymous if you wish it. '
            + 'Simply don\'t fill out your name.)');
    }

    /**
     * @return {string}
     */
    help() {
        return 'Sends back a link to the feedback form';
    }
};
