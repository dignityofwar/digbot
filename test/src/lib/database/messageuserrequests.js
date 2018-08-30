//  Copyright © 2018 DIG Development team. All rights reserved.

const should = require('chai').should();

const messageUserRequests = require('../../../../src/lib/database/messageuserrequests.js');

describe('database/messageuserrequests.js', function() {
    it('should have function execute', function() {
        messageUserRequests.should.have.property('execute');
    });
});
