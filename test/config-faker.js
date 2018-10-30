const _ = require("lodash");

const mock = require('mock-require');

class configFaker {
    constructor() {
        const config = require('config');
        this.config = config instanceof configFaker ? config.config : config;

        this.resetFake();
    }

    get(property) {
        return _.get(this.fake, property, this.config.get(property));
    }

    has(property) {
        return _.has(this.fake, property) || this.config.has(property);
    }

    get util() {
        return this.config.util;
    }

    setFake(object = {}) {
        this.fake = object;
    }

    setFakeProperty(property, value) {
        _.set(this.fake, property, value);
    }

    resetFake() {
        this.fake = {};
    }
}

if (!global.Faker) {
    global.Faker = new configFaker;
}

if (!(require('config') instanceof configFaker)) {
    mock('config', Faker);
}

Faker.resetFake();