//  Copyright © 2018 DIG Development team. All rights reserved.

const should = require('chai').should();

const admin = require('../../../../src/lib/admin/admin.js');
const config = require('config');

describe('admin/admin.js', function() {
    it('should have function antispamCheck', function() {
        admin.should.have.property('antispamCheck');
        admin.antispamCheck.should.be.a('function');
    });

    it('should have function check', function() {
        admin.should.have.property('check');
        admin.check.should.be.a('function');
    });

    it('check should return false if msg not from correct server', function() {
        const msg = {guild: {id: '00000004440000000'}};
        admin.check(msg).should.be.false;
    });

    it('check should return true if msg from correct server', function() {
        Faker.setFakeProperty('features.disableMentionSpam', true);
        const msg = {guild: {id: config.get('general.server')}, member: {id: config.get('botUserID')}};
        admin.check(msg).should.be.true;
        Faker.resetFake();
    });

    it('should have function checkEdits', function() {
        admin.should.have.property('checkEdits');
        admin.checkEdits.should.be.a('function');
    });

    it('should have function checkPlaying', function() {
        admin.should.have.property('checkPlaying');
        admin.checkPlaying.should.be.a('function');
    });

    it('should have function joinChecks', function() {
        admin.should.have.property('joinChecks');
        admin.joinChecks.should.be.a('function');
    });

    it('should have function memberUpdate', function() {
        admin.should.have.property('memberUpdate');
        admin.memberUpdate.should.be.a('function');
    });

    it('should have function modularChannels', function() {
        admin.should.have.property('modularChannels');
        admin.modularChannels.should.be.a('function');
    });

    it('should have function ready', function() {
        admin.should.have.property('ready');
        admin.ready.should.be.a('function');
    });

    it('should have function startchecks', function() {
        admin.should.have.property('startchecks');
        admin.startchecks.should.be.a('function');
    });
});
