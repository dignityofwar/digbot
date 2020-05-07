const OutfitModeratorException = require('./outfitmoderatorexception');

module.exports = class HasClaim extends OutfitModeratorException {
    constructor(member, name, checker) {
        super(member, name, checker);
    }
};
