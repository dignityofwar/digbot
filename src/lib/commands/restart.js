const Command = require('../core/command');

module.exports = class StatsCommand extends Command {
    /**
     * @param logger
     */
    constructor({ logger }) {
        super();

        this.name = 'restart';

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
};
