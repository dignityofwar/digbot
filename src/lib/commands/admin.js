const Command = require('../core/command');

const messages = [
    '__Admin Commands__:',
    '**!roles**: PM a list of all roles and their associated IDs',
    '**!positions**: PM a list of all channels and their associated position variables',
    '**!restart**: Restarts the bot (Please do not use unless the bot is spazzing the fuck out)',
    '**!sort**: Manually trigger a global sort of all channels (Should run automatically when necesary)',
];

module.exports = class StatsCommand extends Command {
    constructor() {
        super();

        this.name = 'admin';
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
    createReply() {
        return messages.reduce((a, b) => `${a}\n${b}`);
    }
};
