'use strict';

// const {instanceOfOrFail} = require('./validation')

module.exports = {

    catchException(exception, handlers = []) {
        const handler = handlers.find(e => exception instanceof e[0]);

        if (handler instanceof Function) {
            console.log('bliep');
        }
    },
};
