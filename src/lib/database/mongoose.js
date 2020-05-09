const { Mongoose } = require('mongoose');

const mongoose = new Mongoose();

// mongoose.set('debug', config.get('debug'));
mongoose.set('useFindAndModify', false);

module.exports = mongoose;
