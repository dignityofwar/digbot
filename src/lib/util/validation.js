const { isString, isFunction } = require('lodash');

module.export = {

    /**
     * Checks whether the instance is related to the constructor, throws an
     * type error when it is not
     *
     * @param {Object} instance
     * @param {Class} constructor
     * @param {string} varname
     *
     * @throws {TypeError}
     * @return {void}
     */
    instanceOfOrFail(instance, constructor, varname) {

        if (!(instance instanceof constructor)) {
            throw new TypeError(
                `Expected "${varname}" to be instance of "${constructor.name}".`);
        }
    },

    /**
     * Checks if the variable contains a string
     *
     * @param {*} variable
     *
     * @return {boolean}
     */
    isString,

    /**
     * Checks if the variable contains a string, throws a type error when it is not
     *
     * @param {*} variable
     * @param {string} varname
     *
     * @throws {TypeError}
     * @return {void}
     */
    isStringOrFail(variable, varname) {

        if (!this.isString(variable)) {
            throw new TypeError(`Expected "${varname}" to ba a String.`);
        }
    },

    isFunction,

    /**
     * Checks if function is async
     *
     * @param constructor
     * @return {boolean}
     */
    isAsyncFunction(constructor) {
        const AsyncFunction = (async () => {}).constructor;

        return constructor instanceof AsyncFunction;
    },
};
