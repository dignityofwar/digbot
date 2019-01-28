const Command = require('../core/command');

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
     * @param message
     * @return {Promise<void>}
     */
    async execute(message) {
        // TODO: Add guard that only admins or owners can restart the bot

        this.logger.log('info', {
            message: `Restarting the bot requested by ${message.author.name}`,
            label: '!restart',
        });

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
