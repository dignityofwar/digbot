const OutfitModeratorException = require('./outfitmoderatorexception');

module.exports = class CharacterNotFound extends OutfitModeratorException {
    constructor(member, name, checker) {
        super(member, name, checker);
    }
};
