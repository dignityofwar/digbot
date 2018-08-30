//  Copyright © 2018 DIG Development team. All rights reserved.

const should = require('chai').should();

const restart = require('../../../../src/lib/commands/restart.js');

describe('commands/restart.js', function() {
    // Can only do a very basic test here for obvious reasons
    it('should have function execute', function() {
        restart.should.have.property('execute');
        restart.execute.should.be.a('function');
    });
});
