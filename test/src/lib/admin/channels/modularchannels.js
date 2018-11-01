//  Copyright © 2018 DIG Development team. All rights reserved.

const should = require('chai').should();

const config = require('config');
const MCS = require('../../../../../src/lib/admin/channels/modularchannels.js');

describe('admin/channels/modularchannels.js', function() {
    it('should have function execute', function() {
        MCS.should.have.property('execute');
        MCS.execute.should.be.a('function');
    });

    const original = config.get('features');
    let features = original;
    const noChannelMember = {voiceChannel: false};

    it('execute should return false if feature disabled', function() {
        Faker.setFakeProperty('features.modularChannelSystem', false);
        MCS.execute(noChannelMember, noChannelMember).should.be.false;
        Faker.resetFake();
    });

    it('execute should return true if feature enabled', function() {
        Faker.setFakeProperty('features.modularChannelSystem', true);
        MCS.execute(noChannelMember, noChannelMember).should.be.true;
        Faker.resetFake();
    });

    it('should have function ready', function() {
        MCS.should.have.property('ready');
        MCS.ready.should.be.a('function');
    });

    it('ready should return false if feature disabled', function() {
        Faker.setFakeProperty('features.modularChannelSystem', false);
        MCS.ready().should.be.false;
        Faker.resetFake();
    });

    it('ready should return true if feature enabled', function() {
        Faker.setFakeProperty('features.modularChannelSystem', true);
        MCS.ready().should.be.true;
        Faker.resetFake();
    });
});
