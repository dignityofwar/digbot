//  Copyright © 2018 DIG Development team. All rights reserved.

const expect = require('chai').expect;
const should = require('chai').should();
const sinon = require('sinon');

const cats = require('../../../../src/lib/commands/cats.js');

describe('commands/cats.js', function() {
    // Call the promises first so we don't do them in every single test
    let gifPromise = cats.gif();
    let imgPromise = cats.img();

    it('should have function gif', function() {
        cats.should.have.property('gif');
        cats.gif.should.be.a('function');
    });

    it('GIF should be a promise', function() {
        gifPromise.should.be.a('promise');
    });

    it('GIF should return promise', function(done) {
        this.timeout(10000);
        gifPromise.then(
            function(result) {
                console.log('Cats GIF Result:', result);
                result.should.be.fulfilled;
                done();
            }
        );
    });

    it('GIF should contain a message with http://', function(done) {
        this.timeout(10000);
        gifPromise.then(
            function(result) {
                expect(result).to.have.string('http://');
                done();
            }
        );
    });

    it('GIF should contain a message with .gif', function(done) {
        this.timeout(10000);
        gifPromise.then(
            function(result) {
                expect(result).to.have.string('.gif');
                done();
            }
        );
    });

    it('should have function img', function() {
        cats.should.have.property('img');
        cats.img.should.be.a('function');
    });

    it('IMG should be a promise', function() {
        imgPromise.should.be.a('promise');
    });

    it('IMG should return promise', function(done) {
        this.timeout(10000);
        imgPromise.then(
            function(result) {
                console.log('Cats IMG Result:', result);
                result.should.be.fulfilled;
                done();
            }
        );
    });

    it('IMG should contain a message with http://', function(done) {
        this.timeout(10000);
        imgPromise.then(
            function(result) {
                expect(result).to.have.string('http://');
                done();
            }
        );
    });

    it('IMG should contain a message with .jpg', function(done) {
        this.timeout(10000);
        imgPromise.then(
            function(result) {
                expect(result).to.have.string('.jpg');
                done();
            }
        );
    });
});
