//  Copyright © 2018 DIG Development team. All rights reserved.

const should = require('chai').should();

const autoDelete = require('../../../../../src/lib/admin/channels/autodelete.js');

describe('admin/channels/autodelete.js', function() {
    it('should have function execute', function() {
        autoDelete.should.have.property('execute');
    });
});
