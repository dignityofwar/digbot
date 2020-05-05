module.exports = class OutfitModeratorException extends Error {
    constructor(member, name, checker) {
        super();

        this.member = member;
        this.name = name;
        this.checker = checker;
    }
};
