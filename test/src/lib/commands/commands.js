//  Copyright © 2018 DIG Development team. All rights reserved.

const assert = require('chai').assert;
const expect = require('chai').expect;
const should = require('chai').should();

const commands = require('../../../../src/lib/commands/commands.js');

describe('commands/commands.js', function() {
    it('should have property all containing all commands', function() {
        commands.should.have.property('all');
        commands.all.should.be.an('array');
        commands.all.indexOf('!ping').should.not.eql(-1);
    });

    it('should have function check', function() {
        commands.should.have.property('check');
        commands.check.should.be.a('function');
    });

    it('check should identify commands', function() {
        // Control input
        commands.check('!ping').should.be.true;
        // Test all on file
        for (var x in commands.all) {
            commands.check(commands.all[x]).should.be.true;
        }
        commands.check('!thisisnotarealcommand!').should.be.false;
    });

    it('should have function filter', function() {
        commands.should.have.property('filter');
        commands.filter.should.be.a('function');
    });

    it('filter should return the command contained in a string', function() {
        commands.filter('!help', 'all').should.be.equal('!help');
        commands.filter('!ping', 'all').should.be.equal('!ping');
    });

    it('filter should work with spaces attached to the string', function() {
        commands.filter('!help                  ', 'all').should.be.equal('!help');
        commands.filter('!ping               ', 'all').should.be.equal('!ping');
    });

    it('filter should return false when there\'s no command', function() {
        expect(commands.filter('a'), 'all').to.be.false;
        assert(commands.filter('!thisisnotarealcommand!', 'all') === false, 'This should not contain a command');
    });

    it('should have function proxy', function() {
        commands.should.have.property('proxy');
        commands.proxy.should.be.a('function');
    });

    it('proxy should return false if not command', function() {
        commands.proxy({'content': 'penapplepen'}).should.be.false;
        commands.proxy({'content': '!thisisnotafunction'}).should.be.false;
    });
});
