//  Copyright © 2018 DIG Development team. All rights reserved.

const should = require('chai').should();

const admin = require('../../../../src/lib/commands/admin.js');

describe('commands/admin.js', function() {
    it('should have function execute', function() {
        admin.should.have.property('execute');
        admin.execute.should.be.a('function');
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

    it('should return confirmation response', function() {
        admin.execute(member).should.eql('I\'ll PM you the list of admin commands JBuilds');
    });

    it('should send command list as message', function() {
        success = false;
        recieved = '';
        admin.execute(member);
        success.should.be.true;
        recieved.indexOf('__Admin Commands__:').should.eql(0);
    });
});
