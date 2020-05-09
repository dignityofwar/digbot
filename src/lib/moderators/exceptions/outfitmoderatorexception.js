module.exports = class OutfitModeratorException extends Error {
    constructor(member, character) {
        super();

        this.member = member;
        this.character = character;
    }
};
