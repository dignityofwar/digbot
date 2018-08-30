//  Copyright © 2018 DIG Development team. All rights reserved.

const should = require('chai').should();

const started = require('../../../../src/lib/commands/started.js');

describe('commands/started.js', function() {
    it('should have function duration', function() {
        started.should.have.property('duration');
        started.duration.should.be.a('function');
    });

    it('duration should return a string desribing runtime', function() {
        started.should.have.property('duration');
        const timenow = new Date();
        started.duration(timenow).should.be.string('I\'ve been running for: 0 seconds.');

        const time5minago = new Date(timenow.getTime() - 5 * 60000);
        started.duration(time5minago).should.be.string('I\'ve been running for: 5 minutes, 0 seconds.');
    });
});
