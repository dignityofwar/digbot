const Command = require('./foundation/command');

module.exports = class RestartCommand extends Command {
    /**
     * @param logger
     */
    constructor({ kernel, logger }) {
        super();

        this.name = 'restart';
        this.special = true;

        this.kernel = kernel;
        this.logger = logger;
    }

    /**
     * @param request
     * @return {Promise<void>}
     */
    async execute(request) {
        this.logger.log('info', {
            message: `Restarting the bot requested by ${request.message.author.name}`,
            label: '!restart',
        });

        await request.respond('See you in a bit.');

        this.kernel.terminate(0);
    }

    /**
     * @return {string}
     */
    help() {
        return 'Restarts the bot (Please do not use unless the bot is spazzing the fuck out)';
    }
};
