const { asClass } = require('awilix');
const App = require('./lib/core/app');
const Kernel = require('./lib/core/kernel');

const app = new App();

app.register('kernel', asClass(Kernel).singleton());

module.exports = app;
