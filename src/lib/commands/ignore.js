const config = require('config');

const Command = require('./foundation/command');

module.exports = class IgnoreCommand extends Command {
    constructor() {
        super();

        this.name = 'ignore';
    }

    /**
     * @param request
     * @return {Promise<void>}
     */
    async execute(request) {
        if (!config.has(`guilds.${request.guild.id}.ignoreAutoAssignmentRole`)) {
            return request.respond('This server doesn\'t have this role.');
        }

        const role = config.get(`guilds.${request.guild.id}.ignoreAutoAssignmentRole`);

        if (request.member.roles.has(role)) {
            await request.member.removeRole(role);

            return request.reply('I removed the role, auto role assignment is enabled again for you.');
        }

        await request.member.addRole(role);

        return request.reply('auto role assignment is disabled for you.');
    }

    /**
     * @return {string}
     */
    help() {
        return 'Assigns the ignore role to you which prevents auto role assignments. You can still assign roles with the !pretend command.';
    }
};
