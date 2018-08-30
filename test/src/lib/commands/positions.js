//  Copyright © 2018 DIG Development team. All rights reserved.

const should = require('chai').should();

const positions = require('../../../../src/lib/commands/positions.js');
const server = require('../../../../src/lib/server/server.js');

describe('commands/positions.js', function() {
    it('should have function execute', function() {
        positions.should.have.property('execute');
        positions.execute.should.be.a('function');
    });

    // Build fake member object for test
    let member = {
        displayName: 'JBuilds',
        sendMessage: function(message) {
            return new Promise(function(resolve) {
                success = true;
                recieved = message;
                resolve(message);
            });
        }
    };
    let recieved = '';
    let success = false;

    it('should reject if server not ready', function() {
        server.markAsNotReady();
        recieved = '';
        success = false;
        positions.execute(member).should.eql('Sorry but server is currently not ready, ' +
            'please try again in a second');
        recieved.length.should.eql(0);
        success.should.be.false;
    });

    it('should send positions to member', function() {
        server.markAsReady();
        if (!server.getReady()) { this.skip(); }
        recieved = '';
        success = false;
        positions.execute(member);
        recieved.indexOf('channel positions**:').should.not.eql(-1);
        success.should.be.true;
    });

    it('should return success response', function() {
        server.markAsReady();
        if (!server.getReady()) { this.skip(); }
        recieved = '';
        success = false;
        positions.execute(member).should.eql('I\'ll PM you a list of channel positions');
    });
});
