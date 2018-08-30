//  Copyright © 2018 DIG Development team. All rights reserved.

const should = require('chai').should();

const crashHandler = require('../../../src/lib/crash-handling.js');

describe('crash-handling/crash-handling.js', function() {
    it('should have function error', function() {
        crashHandler.should.have.property('error');
        crashHandler.error.should.be.a('function');
    });

    it('should have function logEvent', function() {
        crashHandler.should.have.property('logEvent');
        crashHandler.logEvent.should.be.a('function');
    });

    it('should have function logMessage', function() {
        crashHandler.should.have.property('logMessage');
        crashHandler.logMessage.should.be.a('function');
    });
});
