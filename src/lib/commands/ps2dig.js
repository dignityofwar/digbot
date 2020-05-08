const config = require('config');
const { get } = require('lodash');
const Command = require('./foundation/command');
const { extractPs2Name } = require('../util/extractors');

const HasClaim = require('../moderators/exceptions/hasclaim');
const CharacterNotFound = require('../moderators/exceptions/playernotfound');
const NotInOutfit = require('../moderators/exceptions/notinoutfit');
const ProtectedRank = require('../moderators/exceptions/protectedrank');
const Claimed = require('../moderators/exceptions/claimed');

module.exports = class Ps2digCommand extends Command {
    constructor({ moderatorsOutfitmoderator }) {
        super();

        this.name = 'ps2dig';

        this.moderator = moderatorsOutfitmoderator;
    }

    /**
     * @param request
     * @return {Promise<void>}
     */
    async execute(request) {
        if (!config.has(`guilds.${request.guild.id}.ps2CharacterClaimer`)) {
            return request.reply('This feature is not enabled on this server');
        }

        const cnfg = config.get(`guilds.${request.guild.id}.ps2CharacterClaimer`);
        const rev = cnfg.useName && cnfg.automatic;

        if (Array.isArray(cnfg.exclude) && cnfg.exclude.some(r => request.member.roles.has(r))) {
            return request.react('🔒');
        }

        try {
            const claim = rev
                ? await this.moderator.revalidateClaim(request.member, extractPs2Name(request.member))
                : await this.moderator.makeClaim(request.member, this.getFirstArgument(request));

            await request.member.addRole(cnfg.role);

            return request.reply(`Welcome to the outfit ${claim.name}!`);
        } catch (e) {
            if (e instanceof HasClaim) {
                return request.reply('It seems you have already claimed a character.');
            }
            if (e instanceof CharacterNotFound) {
                if (rev && request.member.roles.has(cnfg.role)) {
                    await request.member.removeRole(cnfg.role);

                    return request.reply(
                        'I couldn\'t find you character, I removed your role as you need a valid claim.');
                }

                return request.reply('I couldn\'t find your character');
            }
            if (e instanceof NotInOutfit) {
                return request.reply(
                    'I asked command and they have never heard of you private. *suspicion intensifies*');
            }
            if (e instanceof ProtectedRank) {
                return request.reply(`Hmmmm, impressive rank you got there ${e.character.name.first}, `
                    + 'however I cannot give you that role without seeing some papers first.');
            }
            if (e instanceof Claimed) {
                if (e.claim.member === request.member.id) {
                    return request.reply(
                        `The character '${e.character.name.first}' you are trying to claim is already yours.`);
                }

                return request.reply(`The character '${e.character.name.first}' you are trying to claim, seems to be `
                    + 'claimed already by another. If think this is incorrect, please contact an moderator.');
            }

            throw e;
        }
    }

    /**
     * @param request
     * @return {String}
     */
    getFirstArgument(request) {
        return request.content.match(/[^\s]+/g)[1];
    }

    /**
     * @return {string}
     */
    help() {
        return 'Checks whether you are in the outfit and assigns you the appropriate role. '
            + 'Make sure your nickname for this server is the same as your ign.';
    }
};
