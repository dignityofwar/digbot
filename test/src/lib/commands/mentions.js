//  Copyright © 2018 DIG Development team. All rights reserved.

const should = require('chai').should();

const config = require('config');
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

    const original = config.get('features');
    let features = original;

    it('should have function execute', function() {
        mentions.should.have.property('execute');
        mentions.execute.should.be.a('function');
    });

    it('should let user know if feature is disabled', function() {
        resetTest();
        Faker.setFakeProperty('features.disableMentionSpam', true);
        mentions.execute(msg).should.be.false;
        Faker.resetFake();
        channelMessage.indexOf('JBuilds, the mention limits are currently disabled. Ple').should.eql(0);
    });

    it('should let user know if they are exempt from limits', function() {
        // Staff role exemption
        resetTest();
        Faker.setFakeProperty('features.disableMentionSpam', false);
        msg.member.roles.set(config.get('general.staffRoleID'), {test1: 'test'});
        mentions.execute(msg).should.be.false;
        Faker.resetFake();
        channelMessage.should.eql('JBuilds, you are exempt from the mention limit');
        // Leader role exemptions
        for (let x in config.get('general.leaderRoles')) {
            resetTest();
            Faker.setFakeProperty('features.disableMentionSpam', false);
            msg.member.roles.set(config.get('general.leaderRoles')[x], {test1: 'test'});
            mentions.execute(msg).should.be.false;
            Faker.resetFake();
            channelMessage.should.eql('JBuilds, you are exempt from the mention limit');
        }
    });

    it('should let user know if they are exempt from limits', function() {
        resetTest();
        Faker.setFakeProperty('features.disableMentionSpam', false);
        mentions.execute(msg).should.be.true;
        Faker.resetFake();
        channelMessage.indexOf('__JBuilds\'s mention allowance__:').should.eql(0);
        channelMessage.indexOf('mentions remaining:').should.not.eql(-1);
    });
});
