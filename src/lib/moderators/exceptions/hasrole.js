const OutfitModeratorException = require('./outfitmoderatorexception');

module.exports = class Claimed extends OutfitModeratorException {
    constructor(member, name, checker) {
        super(member, name, checker);
    }
};
