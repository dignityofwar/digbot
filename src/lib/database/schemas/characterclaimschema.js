const { Schema } = require('mongoose');

module.exports = new Schema({
    guild: String,
    member: String,
    claimed: Boolean,
    character: String,
    claims: [
        new Schema({
            member: String,
            name: String,
            at: Date,
        })],
});
