const { asClass } = require('awilix');
const { capitalize } = require('lodash');
const { join, relative } = require('path');

module.exports = class LoadModules {
    /**
     * Load all modules into the container
     *
     * @param app
     */
    bootstrap({ app }) {
        const root = 'src/lib';

        app.loadModules(
            this.locations.map(glob => join(root, glob)),
            {
                formatName: (name, { path }) => {
                    // TODO: Probably want to change this more in line with the namespaces from php
                    const splat = relative(join(process.cwd(), root), path)
                        .split('/');

                    splat.pop();

                    return splat.shift().toLowerCase()
                        + splat.reduce((a, b) => a + capitalize(b), '')
                        + capitalize(name);
                },
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
            'commands/*.js',
            'apis/*.js',
        ];
    }
};
