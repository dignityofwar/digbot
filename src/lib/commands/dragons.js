const config = require('config');
const Command = require('./foundation/command');

module.exports = class DragonsCommand extends Command {
    constructor() {
        super();

        this.name = 'dragons';
    }

    /**
     * @param request
     * @return {Promise<void>}
     */
    async execute(request) {
        if (!config.has(`guilds.${request.guild.id}.dragonRole`)) {
            return request.respond('This server doesn\'t have this role.');
        }

        const dragonRole = config.get(`guilds.${request.guild.id}.dragonRole`);

        if (request.member.roles.has(dragonRole)) {
            await request.member.removeRole(dragonRole);

            return request.reply(
                'you already had the herebedragons role. I\'ve removed it. Type **!dragons** again to resubscribe.',
            );
        }

        await request.member.addRole(dragonRole);

        return request.message.react('🐉');
    }

    /**
     * @return {string}
     */
    help() {
        return '#herebedragons is a private, lawless channel which you can opt into with this command.';
    }
};
