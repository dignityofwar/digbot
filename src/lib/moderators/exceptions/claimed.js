const OutfitModeratorException = require('./outfitmoderatorexception');

module.exports = class Claimed extends OutfitModeratorException {
    constructor(member, character, claim) {
        super(member, character);

        this.claim = claim;
    }
};
