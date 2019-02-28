const Command = require('./foundation/command');
const { pingStatus } = require('../util/ping');

module.exports = class PingCommand extends Command {
    constructor({ discordjsClient }) {
        super();

        this.name = 'ping';

        this.special = true;

        this.client = discordjsClient;
    }

    /**
     * @param request
     * @return {Promise<void>}
     */
    async execute(request) {
        return request.respond(`Ping: ${Math.round(this.client.ping)} (${pingStatus(this.client.ping)})`);
    }

    /**
     * @return {string}
     */
    help() {
        return 'Pong! Test if the bot is alive.';
    }
};
