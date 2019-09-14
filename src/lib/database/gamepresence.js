const mongoose = require('./mongoose');
const gamePresenceSchema = require('./schemas/gamepresenceschema');

module.exports = mongoose.model('gamepresencelogging', gamePresenceSchema);
