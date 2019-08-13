const { create } = require('axios');

module.exports = class TheCatApi {
    constructor() {
        this.axios = create({
            baseURL: 'http://jservice.io/api',
        });
    }

    /**
     * @return {PromiseLike<Object>}
     */
    random() {
        return this.axios.get('random', {
            params: {},
        })
            .then(({ data: [trivia] }) => trivia);
    }
};
