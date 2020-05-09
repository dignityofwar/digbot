const config = require('config');
const Dispatcher = require('../foundation/dispatcher');
const { extractPs2Name } = require('../util/extractors');

module.exports = class OutfitDispatcher extends Dispatcher {
    /**
     * @param discordjsClient
     * @param checkersPs2outfit
     */
    constructor({ discordjsClient, moderatorsOutfitmoderator }) {
        super();

        this.client = discordjsClient;
        this.moderator = moderatorsOutfitmoderator;
    }

    /**
     *
     * @return {Promise<void>}
     */
    async start() {
        this.registerListenersTo(this.client, {
            guildMemberUpdate: (old, member) => {
                if (old.displayName !== member.displayName) {
                    this.check(member);
                }
            },
            guildMemberAdd: member => this.check(member),
        });
    }

    /**
     *
     * @return {Promise<void>}
     */
    async stop() {
        this.unregisterListenersFromAll();
    }

    /**
     * @param member
     */
    async check(member) {
        if (!config.has(`guilds.${member.guild.id}.ps2CharacterClaimer`)) {
            return;
        }

        const cnfg = config.get(`guilds.${member.guild.id}.ps2CharacterClaimer`);

        if (!cnfg.useName || !cnfg.automatic) {
            return;
        }

        if (Array.isArray(cnfg.exclude) && cnfg.exclude.some(r => member.roles.has(r))) {
            return;
        }

        try {
            await this.moderator.revalidateClaim(member, extractPs2Name(member));

            await member.addRole(cnfg.role);
        } catch (e) {

        }
    }
};
