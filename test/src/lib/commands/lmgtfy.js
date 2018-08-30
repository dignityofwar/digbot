//  Copyright © 2018 DIG Development team. All rights reserved.

const should = require('chai').should();

const lmgtfy = require('../../../../src/lib/commands/lmgtfy.js');

describe('commands/lmgtfy.js', function() {
    let msg = {
        cleanContent: ''
    };

    it('should have function execute', function() {
        lmgtfy.should.have.property('execute');
        lmgtfy.execute.should.be.a('function');
    });

    it('should let user know a target is needed', function() {
        msg.cleanContent = '!lmgtfy';
        lmgtfy.execute(msg).should.eql('You still need to ask a question, I can\'t do that myself.');
    });

    it('should return a formatted link', function() {
        msg.cleanContent = '!lmgtfy Where is Greece?';
        lmgtfy.execute(msg).should.eql('There you go! http://lmgtfy.com/?q=Where+is+Greece?');
        msg.cleanContent = '!lmgtfy how old is the Queen?';
        lmgtfy.execute(msg).should.eql('There you go! http://lmgtfy.com/?q=how+old+is+the+Queen?');
    });
});
