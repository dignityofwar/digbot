//  Copyright © 2018 DIG Development team. All rights reserved.

const should = require('chai').should();

const nameCheck = require('../../../../src/lib/welcomepack/namecheck.js');

describe('welcomepack/namecheck.js', function() {
    it('should have function execute', function() {
        nameCheck.should.have.property('execute');
    });

    // Construct fake member object for testing
    let member = {
        displayName: 'Kevin',
        sendMessage: function(message) {
            return new Promise(function(resolve) {
                messageSuccess = true;
                resolve(message);
            });
        },
        setNickname: function() {
            return new Promise(function(resolve) {
                nicknameSucess = true;
                resolve(member);
            });
        }
    };
    let messageSuccess = false;
    let nicknameSucess = false;

    it('nameCheck should approve of sensible name', function() {
        nameCheck.execute(member).should.be.true;
        messageSuccess.should.be.false;
        nicknameSucess.should.be.false;
    });

    it('nameCheck should warn member if their name is stupid', function() {
        // Test slightly less sensible nickname
        member.displayName = '|™ffff';
        messageSuccess = false;
        nicknameSucess = false;
        nameCheck.execute(member).should.be.false;
        messageSuccess.should.be.true;
        nicknameSucess.should.be.false;
    });

    it('nameCheck should force nameChange of unacceptable name', function() {
        // Test #madlads nickname
        member.displayName = '@@34276hwedf g';
        messageSuccess = false;
        nicknameSucess = false;
        nameCheck.execute(member).should.be.false;
        messageSuccess.should.be.true;
        nicknameSucess.should.be.true;
    });
});
