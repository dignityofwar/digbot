//  Copyright © 2018 DIG Development team. All rights reserved.

const assert = require('chai').assert;
const expect = require('chai').expect;
const should = require('chai').should();
const sinon = require('sinon');

const logger = require('../../../src/lib/logger.js');

describe('lib/logger (no output)', function() {
    beforeEach(function() {
        sinon.stub(console, 'log').returns(void 0);
        sinon.stub(console, 'error').returns(void 0);
    });

    afterEach(function() {
        console.log.restore();
        console.error.restore();
    });

    it('should have function setChannel', function() {
        logger.should.have.property('setChannel');
        logger.setChannel(null);
    });

    it('should have function debug', function() {
        logger.should.have.property('debug');
        logger.debug('test', 'This is a test message');
        assert.isTrue(console.log.called, 'log should have been called.');
        console.log.getCall(0).args[0].should.have.string('DEBUG');
    });

    it('should have function botStatus', function() {
        logger.should.have.property('botStatus');
        logger.botStatus('test', 'This is a test message');
        assert.isTrue(console.log.called, 'log should have been called.');
        console.log.getCall(0).args[0].should.have.string('STATUS');
    });

    it('should have function info', function() {
        logger.should.have.property('info');
        logger.info('test', 'This is a test message');
        assert.isTrue(console.log.called, 'log should have been called.');
        console.log.getCall(0).args[0].should.have.string('INFO');
    });

    it('should have function warning', function() {
        logger.should.have.property('warning');
        logger.warning('test', 'This is a test message');
        assert.isTrue(console.log.called, 'log should have been called.');
        console.log.getCall(0).args[0].should.have.string('WARNING');
    });
});
