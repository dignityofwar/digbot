const Command = require('./foundation/command');

const antiduplicate = require('../util/antiduplicate.js');
const catfacts = require('../../assets/catfacts.js');

module.exports = class CatfactsCommand extends Command {
    constructor() {
        super();

        this.name = 'catfacts';
    }

    /**
     * @param request
     * @return {Promise<void>}
     */
    async execute(request) {
        return request.respond(antiduplicate.randomise(
            'catfacts',
            catfacts,
        ));
    }

    /**
     * @return {string}
     */
    help() {
        return 'Will post a random cat fact, drawing from a repository of over 100 cat facts!';
    }
};
