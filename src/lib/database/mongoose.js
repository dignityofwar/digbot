const { Mongoose } = require('mongoose');

const mongoose = new Mongoose();

mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
mongoose.set('keepAlive', true);
mongoose.set('keepAliveInitialDelay', 300000);
// mongoose.set('autoIndex', false);
// mongoose.set('debug', config.get('debug'));

module.exports = mongoose;
