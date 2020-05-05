const config = require('config');
const { get } = require('lodash');
const server = require('../server/server');
const Dispatcher = require('../foundation/dispatcher');
const { extractPs2Name } = require('../util/extractors');

module.exports = class OutfitDispatcher extends Dispatcher {
    /**
     * @param discordjsClient
     * @param checkersPs2outfit
     */
    constructor({ discordjsClient, checkersPs2outfit }) {
        super();

        this.client = discordjsClient;
        this.checker = checkersPs2outfit;

        this.checker.characterNotFound(this.characterNotFound);
        this.checker.inOutfit(this.inOutfit);
        this.checker.notInOutfit(this.notInOutfit);
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
        if (!config.has(`guilds.${member.guild.id}.outfitChecker`)) {
            return;
        }

        const checker = config.get(`guilds.${member.guild.id}.outfitChecker`);

        // Feature switch
        if (!checker.useName || !checker.automatic) {
            return;
        }

        // Revalidation switch
        if (member.roles.has(checker.role) && !checker.revalidate) {
            return;
        }

        await this.checker(extractPs2Name(member), member, checker);
    }

    /**
     * @param name
     * @param outfit
     * @param member
     * @param checker
     */
    characterNotFound(name, outfit, member, checker) {
        return member.removeRole(checker.role, `Revalidated name, character ${name} not found`);
    }

    /**
     * @param character
     * @param member
     * @param checker
     * @return {Promise<*>}
     */
    async inOutfit(character, member, checker) {
        const name = get(character, 'name.first');

        if (checker.filter.includes(get(character, 'outfit_member.rank'))) {
            if (checker.warnRank) {
                server.getChannel('staff')
                    .send(`${member} renamed him/herself to `);
            }
            return;
        }

        // Assign role

        if (member.roles.has(checker.role)) {
            server.getChannel('staff').send(`${member} changed their username. `);
        }

        await member.addRole(checker.role, `Assigned automatically, character name ${name}`);
    }

    /**
     * @param character
     * @param member
     * @param checker
     */
    notInOutfit(character, member, checker) {
        return member.removeRole(checker.role, `Revalidated name, character ${name} not found`);
    }
};
