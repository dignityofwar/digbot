const config = require('config');
const Command = require('./foundation/command');
const positions = require('../admin/channels/positions.js');

module.exports = class SortCommand extends Command {
    constructor() {
        super();

        this.name = 'sort';
        this.special = true;
    }

    /**
     * @param request
     * @return {Promise<*>}
     */
    async execute(request) {
        if (!config.get('features.channelPositionsEnforcement')) {
            return request.respond('Sorry but the channel position enforcement feature is currently disabled');
        }

        positions.globalCheck();

        return request.respond('Sent global sort request to channels/positions.js');
    }

    /**
     * @return {string}
     */
    help() {
        return 'Manually trigger a global sort of all channels (Should run automatically when necesary)';
    }
};
