const { create } = require('axios');

module.exports = class TheCatApi {
    constructor() {
        this.axios = create({
            baseURL: 'https://api.thecatapi.com/v1/',
        });
    }

    /**
     * @return {PromiseLike<String>}
     */
    getImg() {
        return this.axios.get('images/search', {
            params: {
                limit: 1,
                mime_types: 'jpg,png',
            },
        })
            .then(({ data: [{ url }] }) => url);
    }

    /**
     * @return {PromiseLike<String>}
     */
    getGif() {
        return this.axios.get('images/search', {
            params: {
                limit: 1,
                mime_types: 'gif',
            },
        })
            .then(({ data: [{ url }] }) => url);
    }
};
