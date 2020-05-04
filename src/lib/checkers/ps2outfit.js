const { get } = require('lodash');

module.exports = class PS2Outfit {
    constructor({ apisPs2 }) {
        this.api = apisPs2;

        this.characterNotFoundHook = () => {};
        this.inOutfitHook = () => {};
        this.notInOutfitHook = () => {};
    }

    async check(name, outfit, ...pass) {
        const character = await this.api.getCharacterByName(name, { resolve: 'outfit_member' });

        if (!character) {
            return this.characterNotFoundHook(name, outfit, ...pass);
        }

        if (get(character, 'outfit_member.outfit_id') === outfit) {
            return this.inOutfitHook(character, ...pass);
        }

        return this.notInOutfitHook(character, ...pass);
    }

    characterNotFound(cb) {
        this.characterNotFoundHook = cb;
    }

    inOutfit(cb) {
        this.inOutfitHook = cb;
    }

    notInOutfit(cb) {
        this.notInOutfitHook = cb;
    }
};
