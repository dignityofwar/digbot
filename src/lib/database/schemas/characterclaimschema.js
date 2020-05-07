const { Schema } = require('mongoose');

module.exports = new Schema({
    guild: String,
    member: String,
    character: String,
    name: String,
    claims: [
        new Schema({
            character: String,
            name: String,
            at: Date,
        })],
});

module.exports.query.isClaimed = (guild, character) => this.exists({
    guild: guild.id,
    character: character.character_id,
});

module.exports.query.hasClaim = member => this.exists({
    guild: member.guild.id,
    member: member.id,
    character: { $ne: null },
});


module.exports.query.claim = (member, character) => this.findOneAndUpdate({
    guild: member.guild.id,
    member: member.id,
}, {
    character: character.character_id,
    name: character.name.first,
    claims: {
        $push: {
            character: character.character_id,
            name: character.name.first,
            at: Date.now(),
        },
    },
}, {
    new: true,
}).exec();

module.exports.query.unclaim = (guild, character) => this.findOneAndUpdate({
    guild: guild.id,
    character: character.character_id,
}, {
    character: null,
    name: null,
}).exec();
