//  Copyright © 2018 DIG Development team. All rights reserved.

'use strict';

// !catfacts module

const antiduplicate = require('../tools/antiduplicate.js');
const memes = require('../../assets/memes.js');

module.exports = {
    execute() {
        return antiduplicate.randomise(
            'catfacts',
            memes.catfacts,
        );
    },
};
