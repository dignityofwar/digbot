//  Copyright © 2018 DIG Development team. All rights reserved.

const should = require('chai').should();

const config = require('../../../../config/config.js');
const mentions = require('../../../../src/lib/commands/mentions.js');

// Only test mentions.js code here, mentionspam module has its own tests
describe('commands/mentions.js', function() {
    let msg = {
        author: {
            id: '000456303060001'
        },
        channel: {
            sendMessage: function(relay) {
                channelMessage = relay;
                return new Promise(function(resolve) {
                    resolve(true);
                });
            }
        },
        member: {
            displayName: 'JBuilds',
            roles: new Map()
        }
    };
    let channelMessage = false;

    function resetTest() {
        channelMessage = false;
        msg.member.roles = new Map();
        msg.member.roles.set('000001', {name: 'testCh1', type: 'text'});
        msg.member.roles.set('000002', {name: 'testCh2', type: 'text'});
        msg.member.roles.set('000003', {name: 'testCh3', type: 'voice'});
        msg.member.roles.set('000004', {name: 'testCh4', type: 'voice'});
    }

    const original = config.getConfig().features;
    let features = original;

    it('should have function execute', function() {
        mentions.should.have.property('execute');
        mentions.execute.should.be.a('function');
    });

    it('should let user know if feature is disabled', function() {
        resetTest();
        features.disableMentionSpam = true;
        config.setProperty('features', features);
        mentions.execute(msg).should.be.false;
        config.setProperty('features', original);
        channelMessage.indexOf('JBuilds, the mention limits are currently disabled. Ple').should.eql(0);
    });

    it('should let user know if they are exempt from limits', function() {
        // Staff role exemption
        resetTest();
        features.disableMentionSpam = false;
        config.setProperty('features', features);
        msg.member.roles.set(config.getConfig().staffRoleID, {test1: 'test'});
        mentions.execute(msg).should.be.false;
        config.setProperty('features', original);
        channelMessage.should.eql('JBuilds, you are exempt from the mention limit');
        // Leader role exemptions
        for (let x in config.getConfig().general.leaderRoles) {
            resetTest();
            features.disableMentionSpam = false;
            config.setProperty('features', features);
            msg.member.roles.set(config.getConfig().general.leaderRoles[x], {test1: 'test'});
            mentions.execute(msg).should.be.false;
            config.setProperty('features', features);
            channelMessage.should.eql('JBuilds, you are exempt from the mention limit');
        }
    });

    it('should let user know if they are exempt from limits', function() {
        resetTest();
        features.disableMentionSpam = false;
        config.setProperty('features', features);
        mentions.execute(msg).should.be.true;
        config.setProperty('features', original);
        channelMessage.indexOf('__JBuilds\'s mention allowance__:').should.eql(0);
        channelMessage.indexOf('mentions remaining:').should.not.eql(-1);
    });
});
