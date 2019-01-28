const Command = require('../core/command');

const antiduplicate = require('../util/antiduplicate.js');
const catfacts = require('../../assets/catfacts.js');

module.exports = class CatfactsCommand extends Command {
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

    /**
     * @param {boolean} full
     * @return {string}
     */
    help(full) {
        return !full
            ? 'Posts a random cat fact'
            : 'Will return a random cat fact, drawing from a repository of over 100 cat facts!';
    }
};
