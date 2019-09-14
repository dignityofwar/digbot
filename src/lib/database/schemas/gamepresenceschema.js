const { Schema } = require('mongoose');

module.exports = new Schema({
    guild: String,
    member: String,
    game: String,
    start: Date,
    end: Date,
    roles: [{ role: String }],
});
