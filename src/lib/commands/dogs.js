const Command = require('./foundation/command');

module.exports = class CatsCommand extends Command {
    constructor() {
        super();

        this.name = 'dogs';
    }

    /**
     * @param request
     * @return {Promise<void>}
     */
    async execute(request) {
        return request.respond('Srry, no dogs api exists.');
    }

    /**
     * @return {string}
     */
    help() {
        return 'Should do something with dogs.';
    }
};
