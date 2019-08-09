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
        const roles = this.getRoles(member.guild, member.presence);

        if (roles) {
            const add = roles instanceof Array ? member.addRoles : member.addRole;

            add(roles, `Automatically assigned, playing: ${member.presence.game.name})`);
        }
    }

    /**
     * @param guild
     * @param presence
     * @return {undefined|*}
     */
    getRoles(guild, presence) {
        if (presence.game && config.has(`guilds.${guild.id}.roleAssignment`)) {
            const key = Object.keys(config.get(`guilds.${guild.id}.roleAssignment`))
                .find(k => presence.game.name.includes(k));

            if (key) {
                return config.get(`guilds.${guild.id}.roleAssignment.${key}`);
            }
        }

        return undefined;
    }
};
