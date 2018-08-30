//  Copyright © 2018 DIG Development team. All rights reserved.

const should = require('chai').should();

const config = require('../../../../config/config.js');
const sort = require('../../../../src/lib/commands/sort.js');

describe('commands/sort.js', function() {
    it('should have function execute', function() {
        sort.should.have.property('execute');
        sort.execute.should.be.a('function');
    });

    // Tests require to alter this config property, but will reset it back to its original value ASAP
    const original = config.getConfig().features;
    let features = original;

    it('should refuse request if feature disabled', function() {
        features.channelPositionsEnforcement = false;
        config.setProperty('features', features);
        sort.execute().should.eql('Sorry but the channel position enforcement feature is currently disabled');
        config.setProperty('features', original);
    });

    it('should return confirmation response', function() {
        features.channelPositionsEnforcement = true;
        config.setProperty('features', features);
        sort.execute().should.eql('Sent global sort request to channels/positions.js');
        config.setProperty('features', original);
    });
});
