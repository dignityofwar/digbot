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
            this.locations.map((glob) => join(this.root, glob)),
            {
                formatName: this.format.bind(this),
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
            'commands/!(foundation)/**.js',
            'dispatchers/*.js',
            'moderators/*.js',
            'queues/*.js',
            'util/ratelimiter.js',
        ];
    }

    /**
     * @param name
     * @param path
     * @return {String}
     */
    format(name, { path }) {
        const splat = relative(join(process.cwd(), this.root), path)
            .split('/');

        splat.pop();

        return splat.reduce((a, b) => a + capitalize(b), splat.shift().toLowerCase()) + capitalize(name);
    }
};
