const { lstatSync, readdirSync } = require('fs');
const { join } = require('path');

module.exports = {
    readdirfilesSync(dir) {
        return readdirSync(dir).filter(item => lstatSync(join(dir, item)).isFile());
    },
};
