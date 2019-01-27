//  Copyright © 2018 DIG Development team. All rights reserved.

const should = require('chai').should();

const performance = require('../../../../src/lib/util/performance.js');

describe('tools/performance.js', function() {
    it('should have function ready', function() {
        performance.should.have.property('ready');
        performance.ready.should.be.a('function');
    });

    it('should have function execute', function() {
        performance.should.have.property('execute');
        performance.execute.should.be.a('function');
    });

    it('should have function getCpu', function() {
        performance.should.have.property('getCpu');
        performance.getCpu.should.be.a('function');
    });

    describe('test getCpu()', function() {
        result = false;

        before(function(done) {
            performance.getCpu()
                .then(resolved => {
                    result = resolved;
                    done();
                })
                .catch(() => {
                    console.log('getCpu() promise rejected');
                    done();
                });
        });

        it('getCpu should resolve CPU performance', function() {
            result.should.not.be.false;
            isNaN(result).should.be.false;
        });
    });

    it('should have function getMemory', function() {
        performance.should.have.property('getMemory');
        performance.getMemory.should.be.a('function');
    });

    describe('test getMemory()', function() {
        result = false;

        before(function(done) {
            performance.getMemory()
                .then(resolved => {
                    result = resolved;
                    done();
                })
                .catch(() => {
                    console.log('getMemory() promise rejected');
                    done();
                });
        });

        it('getCpu should resolve memory performance', function() {
            result.should.not.be.false;
            isNaN(result).should.be.false;
        });
    });
});
