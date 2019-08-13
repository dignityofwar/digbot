const config = require('config');
const { get } = require('lodash');
const Command = require('./foundation/command');

module.exports = class Ps2digCommand extends Command {
    constructor({ apisPs2 }) {
        super();

        this.name = 'ps2dig';

        this.ps2api = apisPs2;
    }

    /**
     * @param request
     * @return {Promise<void>}
     */
    async execute(request) {
        if (request.member.roles.has(config.get(`guilds.${request.guild.id}.digRole`))) {
            return request.reply('You already have this role. Don\'t be greedy now.');
        }

        const characterName = this.getCharacterName(request.content);

        if (!characterName) {
            return request.reply('A bot needs a name.');
        }

        const character = await this.ps2api.getCharacterByName(characterName);

        if (character) {
            if (get(character, 'outfit.outfit_id') === '37509488620604883') {
                await request.member.addRole(config.get(`guilds.${request.guild.id}.digRole`));

                return request.reply(`Welcome to the outfit ${get(character, 'name.first')}`);
            }

            return request.reply('I asked command and they have never heard of you private. *suspicion intensifies*');
        }

        return request.reply('I couldn\'t find your character.');
    }

    /**
     * @param content
     * @return {String}
     */
    getCharacterName(content) {
        return content.match(/[^\s]+/g)[1];
    }

    /**
     * @return {string}
     */
    help() {
        return 'Assign the dig-ps2 role to yourself by providing your ps2 charactername';
    }
};
