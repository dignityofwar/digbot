const { duration } = require('moment');
const Command = require('./foundation/command');
const performance = require('../util/performance.js');
const { pingStatus } = require('../util/ping');
const { version } = require('../../../package');

module.exports = class StatsCommand extends Command {
    constructor({ discordjsClient }) {
        super();

        this.client = discordjsClient;

        this.name = 'stats';
    }

    /**
     * @param request
     * @return {Promise<void>}
     */
    async execute(request) {
        return Promise.all([
            request.respond('pong'),
            performance.getCpu(),
            performance.getMemory(),
        ])
            .then(([reply, cpu, memory]) => {
                // TODO: Investegate guild presences size. It probably includes offline users.
                //  Don't know if a map impact performance
                // TODO: Use RichEmbed
                reply.edit(
                    '__**DIGBot Stats**__\n'
                    + `**CPU Usage:** ${cpu}%\n`
                    + `**Memory Usage:** ${memory}MB\n`
                    + `**Version:** ${version}\n`
                    + `**Ping:** ${Math.round(this.client.ping)}ms (${pingStatus(this.client.ping)})\n`
                    + `**Runtime:** ${duration(process.uptime(), 'seconds').humanize()}\n`
                    + `**Stable Discord connection for:** ${duration(this.client.uptime).humanize()}\n`
                    + `**Members on server:** ${request.message.guild.memberCount}\n`
                    + `**Server members in-game:** ${request.message.guild.presences.size}`,
                );
            });
    }

    /**
     * @return {string}
     */
    help() {
        return 'Display bot statistics such as uptime, memory usage and number of servers.';
    }
};
