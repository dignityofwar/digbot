const config = require('config');
const Dispatcher = require('../foundation/dispatcher');

module.exports = class ReactionDispatcher extends Dispatcher {
    /**
     * @param discordjsClient
     * @param logger
     */
    constructor({ discordjsClient, logger }) {
        super();

        this.client = discordjsClient;
        this.logger = logger;
    }

    /**
     *
     * @return {Promise<void>}
     */
    async start() {
        this.registerListenersTo(this.client, {
            messageReactionAdd: this.onReactionAdd.bind(this),
            messageReactionRemove: this.onReactionRemove.bind(this),
        });
    }

    /**
     * @return {Promise<void>}
     */
    async stop() {
        this.unregisterListenersFromAll();
    }

    /**
     * @param reaction
     * @param user
     * @return {Promise<void>}
     */
    async onReactionAdd(reaction, user) {
        if (config.has(`roleAssignmentOnReaction.${reaction.message.id}.${reaction.emoji.id}`)) {
            const roles = config.get(`roleAssignmentOnReaction.${reaction.message.id}.${reaction.emoji.id}`);

            try {
                const member = await reaction.message.guild.fetch(user);

                Array.isArray(roles) ? member.addRoles(roles) : member.addRole(roles);
            } catch (e) {
                this.logger.warn(`Unable to assign role: ${e}`);
            }
        }
    }

    /**
     * @param reaction
     * @param user
     * @return {Promise<void>}
     */
    async onReactionRemove(reaction, user) {
        if (config.has(`roleAssignmentOnReaction.${reaction.message.id}.${reaction.emoji.id}`)) {
            const roles = config.get(`roleAssignmentOnReaction.${reaction.message.id}.${reaction.emoji.id}`);

            try {
                const member = await reaction.message.guild.fetch(user);

                Array.isArray(roles) ? member.removeRoles(roles) : member.removeRole(roles);
            } catch (e) {
                this.logger.warn(`Unable to remove role: ${e}`);
            }
        }
    }
};
