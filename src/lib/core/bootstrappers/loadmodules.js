module.exports = class LoadModules {
    constructor({ container }) {
        this.container = container;
    }

    bootstrap() {
        this.container.loadModules(this.locations);
    }

    get locations() {
        return [];
    }
};
