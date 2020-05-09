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
