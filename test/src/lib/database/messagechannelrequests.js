//  Copyright © 2018 DIG Development team. All rights reserved.

const should = require('chai').should();

const messageChannelRequests = require('../../../../src/lib/database/messagechannelrequests.js');

describe('database/messagechannelrequests.js', function() {
    it('should have function execute', function() {
        messageChannelRequests.should.have.property('execute');
    });
});
