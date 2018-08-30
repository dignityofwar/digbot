//  Copyright © 2018 DIG Development team. All rights reserved.

const should = require('chai').should();

const presence = require('../../../../../src/lib/admin/bot/presence.js');

describe('admin/bot/presence.js', function() {
    it('should have function execute', function() {
        presence.should.have.property('execute');
        presence.execute.should.be.a('function');
    });
});
