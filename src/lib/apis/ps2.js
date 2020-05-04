const { create } = require('axios');

// TODO: Should probably create a map with a proxy which will resolve all the stuff

module.exports = class TheCatApi {
    constructor() {
        this.axios = create({
            baseURL: 'http://census.daybreakgames.com/get/ps2:v2',
        });
    }

    /**
     * @param name
     * @param opts
     * @return {Promise|{}|PromiseLike<any>|Promise<any>}
     */
    getCharacterByName(name, opts = { resolve: [] }) {
        return this.axios.get('character', {
            params: {
                'name.first_lower': name.toLowerCase(),
                'c:resolve': this.convertResolve(opts.resolve),
            },
        })
            .then(({ data: { character_list: [character = false] } }) => character);
    }

    convertResolve(resolve) {
        if (resolve instanceof Array) {
            return resolve.reduce((a, v) => `${a},${v}`);
        }

        return resolve;
    }
};
