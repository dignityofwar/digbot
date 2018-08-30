//  Copyright © 2018 DIG Development team. All rights reserved.

const should = require('chai').should();

const positions = require('../../../../../src/lib/admin/channels/positions.js');

describe('channels/positions.js', function() {
    it('should have function globalCheck', function() {
        positions.should.have.property('globalCheck');
        positions.globalCheck.should.be.a('function');
    });
});
