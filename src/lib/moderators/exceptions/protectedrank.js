const OutfitModeratorException = require('./outfitmoderatorexception');

module.exports = class ProtectedRank extends OutfitModeratorException {
    constructor(member, name, checker, character) {
        super(member, name, checker);

        this.character = character;
    }
};
