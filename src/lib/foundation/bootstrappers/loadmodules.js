const { asClass } = require('awilix');
const { capitalize } = require('lodash');
const { join, relative } = require('path');

module.exports = class LoadModules {
    constructor() {
        this.root = 'src/lib';
    }

    /**
     * Load all modules into the container
     *
     * @param app
     */
    bootstrap({ app }) {
        app.loadModules(
            this.locations.map(glob => join(this.root, glob)),
            {
                formatName: this.format.bind(this),
                resolverOptions: {
                    register: asClass,
                },
            },
        );
    }

    /**
     * Returns all locations loadModules should search in
     *
     * @return {Array}
     */
    get locations() {
        return [
            'apis/*.js',
            'commands/*.js',
            'dispatchers/*.js',
            'processors/*.js',
            'util/ratelimiter.js',
        ];
    }

    /**
     * @param name
     * @param path
     * @return {String}
     */
    format(name, { path }) {
        // TODO: Probably want to change this more in line with the namespaces from php
        const splat = relative(join(process.cwd(), this.root), path)
            .split('/');

        splat.pop();

        return splat.reduce((a, b) => a + capitalize(b), splat.shift().toLowerCase()) + capitalize(name);
    }
};
