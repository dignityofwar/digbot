const config = require('config');
const { get } = require('lodash');
const Command = require('./foundation/command');

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
        if (!config.has(`guilds.${request}.outfitChecker`)) {
            return request.reply('This feature is not enabled on this server');
        }

        const checker = config.get(`guilds.${request}.outfitChecker`);

        if (request.member.roles.has(checker.role)) {
            return request.reply('You already have this role. Don\'t be greedy now.');
        }

        return this.checker.check(request.member.nickname, checker.outfit, request, checker);
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

    async inOutfit(character, request, checker) {
        const name = get(character, 'name.first');

        if (checker.filter.includes(get(character, 'outfit_member.rank'))) {
            return request.reply(`Hmmmm, impressive rank you got there ${name}, `
                + 'however I cannot give you that role without seeing some papers first.');
        }

        await request.member.addRole(checker.role);

        return request.reply(`Welcome to the outfit ${name}`);
    }

    notInOutfit(character, request) {
        return request.reply('I asked command and they have never heard of you private. *suspicion intensifies*');
    }
};
