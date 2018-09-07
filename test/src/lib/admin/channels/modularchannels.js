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
        features.modularChannelSystem = false;
        config.setProperty('features', features);
        MCS.execute(noChannelMember, noChannelMember).should.be.false;
        config.setProperty('features', original);
    });

    it('execute should return true if feature enabled', function() {
        features.modularChannelSystem = true;
        config.setProperty('features', features);
        MCS.execute(noChannelMember, noChannelMember).should.be.true;
        config.setProperty('features', original);
    });

    it('should have function ready', function() {
        MCS.should.have.property('ready');
        MCS.ready.should.be.a('function');
    });

    it('ready should return false if feature disabled', function() {
        features.modularChannelSystem = false;
        config.setProperty('features', features);
        MCS.ready().should.be.false;
        config.setProperty('features', original);
    });

    it('ready should return true if feature enabled', function() {
        features.modularChannelSystem = true;
        config.setProperty('features', features);
        MCS.ready().should.be.true;
        config.setProperty('features', original);
    });
});
