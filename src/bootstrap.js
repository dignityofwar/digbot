const { asClass } = require('awilix');
const App = require('./lib/foundation/app');
const Kernel = require('./lib/foundation/kernel');

const app = new App();

app.register('kernel', asClass(Kernel).singleton());

module.exports = app;
