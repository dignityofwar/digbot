//  Copyright © 2018 DIG Development team. All rights reserved.

const should = require('chai').should();

const antiduplicate = require('../../../../src/lib/tools/antiduplicate.js');

describe('tools/antiduplicate.js', function() {
    it('should have function randomise', function() {
        antiduplicate.should.have.property('randomise');
        antiduplicate.randomise.should.be.a('function');
    });

    it('if array length is 1, should always return that index', function() {
        const array = ['six'];
        for (let i = 0; i < 10; i++) {
            antiduplicate.randomise('test1', array).should.eql('six');
        }
    });

    it('if array length is 2, should alternate in the index returned', function() {
        const array = ['one', 'two'];
        let last = antiduplicate.randomise('test1', array);
        for (let i = 0; i < 15; i++) {
            if (last === 'one') {
                last = antiduplicate.randomise('test1', array);
                last.should.eql('two');
            } else {
                last = antiduplicate.randomise('test1', array);
                last.should.eql('one');
            }
        }
    });

    it('for arrays of length > 1 should never return the same index in immidiate succession', function() {
        const array = ['one', 'two', 'three', 'four'];
        let previous = antiduplicate.randomise('test2', array);
        let now = antiduplicate.randomise('test2', array);
        for (let i = 0; i < 30; i++) {
            previous = now;
            now = antiduplicate.randomise('test2', array);
            previous.should.not.eql(now);
        }
    });
});
