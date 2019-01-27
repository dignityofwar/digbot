const { get, unset, update } = require('lodash');
const moment = require('moment');

// TODO: Should use Redis, but this requires some investigating
module.exports = class RateLimiter {
    constructor() {
        this.list = {};

        // TODO: Clear the list every so often so expired items are removed
        // setInterval(() => {
        //
        // }, 5000 * 60)
    }

    /**
     * @param key
     * @param max
     * @return {boolean}
     */
    tooManyAttempts(key, max) {
        this.keyValidator(key);

        if (this.attempts(key) >= max) {
            if (get(this.list, `${key}[1]`, moment())
                .isAfter(moment())) {
                return true;
            }

            this.clear(key);
        }

        return false;
    }

    /**
     * @param key
     * @param decay
     */
    hit(key, decay) {
        this.keyValidator(key);

        if (get(this.list, `${key}[1]`, moment())
            .isSameOrBefore(moment())) {
            this.clear(key);
        }

        update(this.list, `${key}[0]`, (attempts = 0) => attempts + 1);
        update(this.list, `${key}[1]`, timeout => (timeout || moment()).add(decay, 'm'));

        return this.attempts(key);
    }

    /**
     * @param key
     */
    attempts(key) {
        this.keyValidator(key);

        return get(this.list, `${key}[0]`, 0);
    }

    // resetAttempts(key) {
    //     this.keyValidator(key);
    //
    //     return unset(this.list, `${key}[0]`);
    // }

    /**
     * @param key
     * @param max
     * @return {number}
     */
    retriesLeft(key, max) {
        this.keyValidator(key);

        return max - this.attempts(key);
    }

    /**
     * @param key
     */
    clear(key) {
        this.keyValidator(key);

        return unset(this.list, key);
    }

    // availableIn(key) {
    //     this.keyValidator(key);
    //
    //     const timeout = get(this.list, `${key}[1]`, false);
    //
    //     return timeout ?;
    // }

    /**
     * @param key
     */
    keyValidator(key) {
        if (key.indexOf('.') >= 0 || key.indexOf('[') >= 0 || key.indexOf(']') >= 0) {
            throw new Error('Key contains illegal symbols.');
        }
    }
};
