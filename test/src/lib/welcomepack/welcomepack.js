//  Copyright © 2018 DIG Development team. All rights reserved.

const should = require('chai').should();

const welcomepack = require('../../../../src/lib/welcomepack/welcomepack.js');

describe('welcomepack/welcomepack.js', function() {
    it('should have function check', function() {
        welcomepack.should.have.property('check');
    });

    it('should have variable message', function() {
        welcomepack.should.have.property('message');
    });
});
