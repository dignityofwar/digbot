//  Copyright © 2018 DIG Development team. All rights reserved.

const expect = require('chai').expect;
const should = require('chai').should();

const catfacts = require('../../../../src/lib/commands/catfacts.js');

describe('commands/catfacts.js', function() {
    // Populate the result so we don't call it multiple times
    const result = catfacts.execute();
    const result2 = catfacts.execute();

    it('should have the function "execute"', function() {
        catfacts.should.have.property('execute');
        catfacts.execute.should.be.a('function');
    });

    it('should return a non-empty result', function() {
        console.log('Catfacts result: ' + result);
        expect(result).to.have.length.of.at.least(5);
    });

    it('should not return the same response as previous (random)', function() {
        console.log('Catfacts result 2: ' + result2);
        expect(result).to.not.equal(result2);
    });
});
