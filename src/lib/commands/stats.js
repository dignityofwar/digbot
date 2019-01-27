const { duration } = require('moment');
const Command = require('../core/command');
const performance = require('../util/performance.js');
const { version } = require('../../../package');

module.exports = class StatsCommand extends Command {
    constructor() {
        super();

        this.name = 'stats';
    }

    /**
     * @param message
     * @return {Promise<void>}
     */
    async execute(message) {
        return Promise.all([
            message.channel.send('pong'),
            performance.getCpu(),
            performance.getMemory(),
        ])
            .then(([reply, cpu, memory]) => {
                // TODO: Investegate guild presences size. It probably includes offline users.
                //  Don't know if a map impact performance
                reply.edit(
                    '__**DIGBot Stats**__\n'
                    + `**CPU Usage:** ${cpu}%\n`
                    + `**Memory Usage:** ${memory}MB\n`
                    + `**Version:** ${version}\n`
                    + `**Ping:** ${Math.round(message.client.ping)}ms (${this.pingStatus(message.client.ping)})\n`
                    + `**Runtime:** ${duration(process.uptime(), 'seconds').humanize()}\n`
                    + `**Stable Discord connection for:** ${duration(message.client.uptime).humanize()}\n`
                    + `**Members on server:** ${message.guild.memberCount}\n`
                    + `**Server members in-game:** ${message.guild.presences.size}`,
                );
            });
    }

    /**
     * @param ping
     * @return {string}
     */
    pingStatus(ping) {
        if (ping < 100) {
            return 'Excellent';
        }
        if (ping < 200) {
            return 'Very Good';
        }
        if (ping < 500) {
            return 'Good';
        }
        if (ping < 1000) {
            return 'Mediocre';
        }
        return 'Bad';
    }
};
