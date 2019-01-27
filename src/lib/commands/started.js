const { duration } = require('moment');
const Command = require('../core/command');

module.exports = class StartedCommand extends Command {
    constructor() {
        super();

        this.name = 'started';
    }

    /**
     * @param message
     * @return {Promise<*>}
     */
    async execute(message) {
        return message.channel.send(this.createReply());
    }

    /**
     * @return {String}
     */
    createReply() {
        const uptime = duration(process.uptime(), 'seconds');

        if (uptime.asDays() >= 1) {
            return `I've been running for ${uptime.humanize()}. Give a bot a break.`;
        }
        if (uptime.asHours() >= 1) {
            return `I've been running for ${uptime.humanize()}. Starting to get tired.`;
        }
        if (uptime.asMinutes() >= 1) {
            return `I've been running for ${uptime.humanize()}. One of these days I'll make it to an hour without some fool restarting me.`;
        }

        return `I've been running for ${uptime.humanize()}. I haven't even been here a minute why are you asking?`;
    }
};
