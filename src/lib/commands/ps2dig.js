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
     * @param message
     * @return {Promise<void>}
     */
    async execute(message) {
        if (message.member.roles.has(config.get(`guilds.${message.guild.id}.digRole`))) {
            return message.reply('You already have this role. Don\'t be greedy now.');
        }

        const characterName = this.getCharacterName(message.cleanContent);

        if (!characterName) {
            return message.reply('A bot needs a name.');
        }

        const character = await this.ps2api.getCharacterByName(characterName);

        if (character) {
            if (get(character, 'outfit.outfit_id') === '37509488620604883') {
                await message.member.addRole(config.get(`guilds.${message.guild.id}.digRole`));

                return message.reply(`Welcome to the outfit ${get(character, 'name.first')}`);
            }

            return message.reply(
                'I asked command and they have never heard of you private. *suspicion intensifies*',
            );
        }

        return message.reply('I couldn\'t find your character.');
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
