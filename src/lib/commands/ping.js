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

        return message.channel.send(`Ping: ${Math.round(ping)} (${this.pingStatus(ping)})`);
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
     * @return {string}
     */
    help() {
        return 'Pong! Test if the bot is alive.';
    }
};
