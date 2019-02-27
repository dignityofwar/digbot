const Command = require('./foundation/command');

module.exports = class RestartCommand extends Command {
    /**
     * @param logger
     */
    constructor({ logger }) {
        super();

        this.name = 'restart';
        this.special = true;

        this.logger = logger;
    }

    /**
     * @param request
     * @return {Promise<void>}
     */
    async execute(request) {
        // TODO: Add guard that only admins or owners can restart the bot

        this.logger.log('info', {
            message: `Restarting the bot requested by ${request.message.author.name}`,
            label: '!restart',
        });

        request.respond('See you in a bit.');

        setTimeout(() => {
            process.exit(0);
        }, 2000);
    }

    /**
     * @return {string}
     */
    help() {
        return 'Restarts the bot (Please do not use unless the bot is spazzing the fuck out)';
    }
};
