//  Copyright © 2018 DIG Development team. All rights reserved.

const should = require('chai').should();

const help = require('../../../../src/lib/commands/help.js');

describe('commands/help.js', function() {
    // Build fake message object for tests
    let msg = {
        content: ''
    };

    // Function to reset the object and results before each test
    function resetTestObject() {
        msg.content = '';
    }

    it('should have the function detailsPass', function() {
        help.should.have.property('detailsPass');
        help.detailsPass.should.be.a('function');
    });

    it('detailsPass should return a property of details given the correct key', function() {
        help.detailsPass('ping').should.be.a('string');
        help.detailsPass('ping').indexOf('**!ping**: This is a').should.eql(0);
        help.detailsPass('dragons').indexOf('**!dragons**: #herebedragons').should.eql(0);
    });

    it('should have function execute', function() {
        help.should.have.property('execute');
        help.execute.should.be.a('function');
    });

    it('execute should core commands on "!help"', function() {
        resetTestObject();
        msg.content = '!help';
        const result = help.execute(msg);
        result.should.be.a('string');
        result.indexOf('__Core Commands__:').should.eql(0);
    });

    it('execute should return the number of messages needed on "!help full"', function() {
        resetTestObject();
        msg.content = '!help full';
        const result = help.execute(msg);
        result.should.be.a('number');
        (result < 4).should.be.true;
    });

    it('should have function helpFull', function() {
        help.should.have.property('helpFull');
        help.helpFull.should.be.a('function');
    });

    it('help full should should return the specified section of the full message', function() {
        resetTestObject();
        msg.content = '!help full';
        const listLength = help.execute(msg);
        for (let i = 0; i < listLength; i++) {
            help.helpFull(i).should.be.a('string');
            help.helpFull(i).indexOf('**: ').should.not.eql(-1);
        }
        help.helpFull(listLength + 1).should.be.false;
    });

    it('should have function pass', function() {
        help.should.have.property('pass');
        help.pass.should.be.a('function');
    });

    it('pass should pass message array', function() {
        help.pass().should.be.a('array');
        help.pass()[0].should.eql('__Core Commands__:');
    });

    it('should have function ready', function() {
        help.should.have.property('ready');
        help.ready.should.be.a('function');
    });
});
