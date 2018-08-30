//  Copyright © 2018 DIG Development team. All rights reserved.

const should = require('chai').should();

const roleRequests = require('../../../../src/lib/database/rolerequests.js');

describe('database/rolerequests.js', function() {
    it('should have function execute', function() {
        roleRequests.should.have.property('execute');
    });
});
