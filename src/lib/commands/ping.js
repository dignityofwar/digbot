const Command = require('../core/command');

module.exports = class PingCommand extends Command {
    constructor() {
        super();

        this.name = 'ping';
    }

    /**
     * @param message
     * @return {Promise<void>}
     */
    async execute(message) {
        const { ping } = message.client;

        return message.channel.send(`Ping: ${ping} (${this.pingStatus(ping)})`);
    }

    /**
     * @param ping
     * @return {string}
     */
    pingStatus(ping) {
        if (ping < 100) {
            return 'Excellent';
        }
        if (ping < 200) {
            return 'Very Good';
        }
        if (ping < 500) {
            return 'Good';
        }
        if (ping < 1000) {
            return 'Mediocre';
        }
        return 'Bad';
    }

    /**
     * @param {boolean} full
     * @return {string}
     */
    help(full) {
        return !full
            ? 'Pong! Test if the bot is alive.'
            : ' This is a classic command use the command "!ping" to get the bot to reply '
            + '"pong", mainly used to test latency, i.e. ping';
    }
};
