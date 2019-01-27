const config = require('config');
const Command = require('../core/command');

/* eslint consistent-return: 0 */
module.exports = class StatsCommand extends Command {
    constructor() {
        super();

        this.name = 'dragons';
    }

    /**
     * @param message
     * @return {Promise<void>}
     */
    async execute(message) {
        // TODO: Maybe use the reasons parameter?
        if (message.guild === config.get('general.server')) { return; }

        const dragonRole = config.get('general.herebedragonsRoleID');

        if (message.member.roles.has(dragonRole)) {
            return message.member.removeRole(dragonRole)
                .then(() => message.reply(
                    'you already had the herebedragons role. I\'ve removed it. Type **!dragons** again to resubscribe.',
                ));
        }

        return message.member.addRole(dragonRole)
            .then(() => message.guild.channels.get(config.get('channels.mappings.herebedragons'))
                .sendMessage(
                    `${message.member.displayName} has been granted access here. Note, this channel is lawless.`
                    + ' If you get triggered, the community staff cannot help you.',
                ));
    }
};
