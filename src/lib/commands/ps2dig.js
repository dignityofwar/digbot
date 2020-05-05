const config = require('config');
const { get } = require('lodash');
const Command = require('./foundation/command');
const { extractPs2Name } = require('../util/extractors');

module.exports = class Ps2digCommand extends Command {
    constructor({ checkersPs2outfit }) {
        super();

        this.name = 'ps2dig';

        this.checker = checkersPs2outfit;

        this.checker.characterNotFound(this.characterNotFound);
        this.checker.inOutfit(this.inOutfit);
        this.checker.notInOutfit(this.notInOutfit);
    }

    /**
     * @param request
     * @return {Promise<void>}
     */
    async execute(request) {
        if (!config.has(`guilds.${request.guild.id}.outfitChecker`)) {
            return request.reply('This feature is not enabled on this server');
        }

        const checker = config.get(`guilds.${request.guild.id}.outfitChecker`);

        if (
            checker.excludedRoles instanceof Array
            && checker.excludedRoles.some(r => request.member.roles.has(r))
        ) {
            return request.react('🔒');
        }

        if (request.member.roles.has(checker.role)) {
            return request.reply('You already have this role. Don\'t be greedy now.');
        }

        return this.checker.check(this.getCharacterName(request, checker), checker.outfit, request, checker);
    }

    /**
     * @param request
     * @param checker
     * @return {*}
     */
    getCharacterName(request, checker) {
        return checker.useName
            ? extractPs2Name(request.member)
            : request.content.match(/[^\s]+/g)[1];
    }

    /**
     * @return {string}
     */
    help() {
        return 'Checks whether you are in the outfit and assigns you the appropriate role. '
            + 'Make sure your nickname for this server is the same as your ign.';
    }

    /**
     * @param name
     * @param outfit
     * @param request
     * @return {*}
     */
    characterNotFound(name, outfit, request) {
        return request.reply('That\'s impossible. Perhaps the archives are incomplete, '
            + 'make sure you nickname on this server and your ign are the same.');
    }

    /**
     * @param character
     * @param request
     * @param checker
     * @return {Promise<*>}
     */
    async inOutfit(character, request, checker) {
        const name = get(character, 'name.first');

        if (checker.filter.includes(get(character, 'outfit_member.rank'))) {
            return request.reply(`Hmmmm, impressive rank you got there ${name}, `
                + 'however I cannot give you that role without seeing some papers first.');
        }

        await request.member.addRole(checker.role, `Assigned using !ps2dig, character name ${name}`);

        return request.reply(`Welcome to the outfit ${name}`);
    }

    /**
     * @param character
     * @param request
     * @return {*}
     */
    notInOutfit(character, request) {
        return request.reply('I asked command and they have never heard of you private. *suspicion intensifies*');
    }
};
