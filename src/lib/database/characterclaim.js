const mongoose = require('./mongoose');
const characterClaimSchema = require('./schemas/characterclaimschema');

module.exports = mongoose.model('characterclaims', characterClaimSchema);
