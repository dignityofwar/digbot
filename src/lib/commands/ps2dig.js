const config = require('config');
const { get } = require('lodash');
const Command = require('./foundation/command');

module.exports = class Ps2digCommand extends Command {
    constructor({ checkerPs2outfitcheck }) {
        super();

        this.name = 'ps2dig';

        this.checker = checkerPs2outfitcheck;

        this.checker.characterNotFound(this.characterNotFound);
        this.checker.inOutfit(this.inOutfit);
        this.checker.notInOutfit(this.notInOutfit);
    }

    /**
     * @param request
     * @return {Promise<void>}
     */
    async execute(request) {
        if (request.member.roles.has(config.get(`guilds.${request.guild.id}.digRole`))) {
            return request.reply('You already have this role. Don\'t be greedy now.');
        }

        return this.checker.check(request.member.nickname, '37509488620604883', request);
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
        return request.reply('I couldn\'t find your character, '
            + 'please check that your nickname is the same as your ign name.');
    }

    async inOutfit(character, request) {
        await request.member.addRole(config.get(`guilds.${request.guild.id}.digRole`));

        return request.reply(`Welcome to the outfit ${get(character, 'name.first')}`);
    }

    notInOutfit(character, request) {
        return request.reply('I asked command and they have never heard of you private. *suspicion intensifies*');
    }
};
