const Command = require('./foundation/command');

module.exports = class Ps2digfeedbackCommand extends Command {
    constructor() {
        super();

        this.name = 'ps2digfeedback';
    }

    /**
     * @param request
     * @return {Promise<void>}
     */
    async execute(request) {
        return request.respond('@here Please post your PS2 Platoon feedback at this form: '
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
