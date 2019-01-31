const { create } = require('axios');

// TODO: Should probably create a map with a proxy which will resolve all the stuff

module.exports = class TheCatApi {
    constructor() {
        this.axios = create({
            baseURL: 'http://census.daybreakgames.com/get/ps2:v2',
        });
    }

    /**
     * @param {String} name
     * @return {PromiseLike<Object>}
     */
    getCharacterByName(name = '') {
        return this.axios.get('character', {
            params: {
                'name.first_lower': name.toLowerCase(),
                'c:resolve': 'outfit',
            },
        })
            .then(({ data: { character_list: [character = false] } }) => character);
    }
};
