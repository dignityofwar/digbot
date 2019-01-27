const Command = require('../core/command');

const antiduplicate = require('../util/antiduplicate.js');
const catfacts = require('../../assets/catfacts.js');

module.exports = class StatsCommand extends Command {
    constructor() {
        super();

        this.name = 'catfacts';
    }

    /**
     * @param message
     * @return {Promise<void>}
     */
    async execute(message) {
        return message.channel.send(antiduplicate.randomise(
            'catfacts',
            catfacts,
        ));
    }
};
