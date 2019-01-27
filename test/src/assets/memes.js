//  Copyright © 2018 DIG Development team. All rights reserved.

const should = require('chai').should();

const memes = require('../../../src/assets/catfacts.js');

describe('assets/catfacts.js', function() {
    it('should have category catfacts', function() {
        memes.should.have.property('catfacts');
    });

    it('all meme.js assets should be strings', function() {
        for (let x in memes) {
            for (let y in memes[x]) {
                if (typeof memes[x][y] === 'object') {
                    for (let z in memes[x][y]) {
                        memes[x][y][z].should.be.a('string');
                    }
                } else {
                    memes[x][y].should.be.a('string');
                }
            }
        }
    });
});
