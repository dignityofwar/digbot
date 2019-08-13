const config = require('config');
const Command = require('./foundation/command');

/* eslint consistent-return: 0 */
module.exports = class DragonsCommand extends Command {
    constructor() {
        super();

        this.name = 'dragons';
        this.onlyHelpFull = true;
    }

    /**
     * @param request
     * @return {Promise<void>}
     */
    async execute(request) {
        // TODO: Maybe use the reasons parameter?
        if (request.guild === config.get('general.server')) { return; } // TODO: This needs to be removed

        const dragonRole = config.get('general.herebedragonsRoleID');

        if (request.member.roles.has(dragonRole)) {
            await request.member.removeRole(dragonRole);

            return request.reply(
                'you already had the herebedragons role. I\'ve removed it. Type **!dragons** again to resubscribe.',
            );
        }

        await request.member.addRole(dragonRole);

        return request.guild.channels.get(config.get('channels.mappings.herebedragons'))
            .send(`${request.member.displayName} has been granted access here. Note, this channel is lawless.`
                + ' If you get triggered, the community staff cannot help you.');
    }

    /**
     * @return {string}
     */
    help() {
        return '#herebedragons is a private, lawless channel which you can opt into with this command.';
    }
};
