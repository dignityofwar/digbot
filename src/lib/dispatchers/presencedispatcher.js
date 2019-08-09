const config = require('config');

const Dispatcher = require('../foundation/dispatcher');

module.exports = class PresenceDispatcher extends Dispatcher {
    /**
     * @param discordjsClient
     * @param logger
     */
    constructor({ discordjsClient }) {
        super();

        this.client = discordjsClient;
    }

    /**
     * @return {Promise<void>}
     */
    async start() {
        this.registerListenersTo(this.client, {
            guildMemberAdd: this.checkPrecense.bind(this),
            presenceUpdate: (old, member) => this.checkPrecense(member),
        });
    }

    /**
     * @return {Promise<void>}
     */
    async stop() {
        this.unregisterListenersFromAll();
    }

    /**
     * @param member
     */
    checkPrecense(member) {
        if (member.user.bot) {
            return;
        }

        const roles = this.getRoles(member.guild, member.presence);

        if (roles) {
            const log = `Automatically assigned, playing: ${member.presence.game.name}`;

            // TODO: Make a queue that handles this
            roles instanceof Array ? member.addRoles(roles, log) : member.addRole(roles, log);
        }
    }

    /**
     * @param guild
     * @param presence
     * @return {undefined|*}
     */
    getRoles(guild, presence) {
        if (presence.game && config.has(`guilds.${guild.id}.autoRoleAssignment`)) {
            const key = Object.keys(config.get(`guilds.${guild.id}.autoRoleAssignment`))
                .find(k => presence.game.name.toUpperCase().includes(k.toUpperCase()));

            if (key) {
                return config.get(`guilds.${guild.id}.autoRoleAssignment.${key}`);
            }
        }

        return undefined;
    }
};
