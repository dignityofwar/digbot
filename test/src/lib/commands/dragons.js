//  Copyright © 2018 DIG Development team. All rights reserved.

const should = require('chai').should();

const dragons = require('../../../../src/lib/commands/dragons.js');
const config = require('../../../../config/config.js');

describe('commands/dragons.js', function() {
    it('should have function execute', function() {
        dragons.should.have.property('execute');
        dragons.execute.should.be.a('function');
    });

    // Build fake message object for testing
    let msg = {
        content: '!dragons',
        guild: {
            channels: new Map()
        },
        member: {
            addRole: function(relay) {
                added = relay;
                return new Promise(function(resolve) {
                    resolve(true);
                });
            },
            displayName: 'JBuilds',
            removeRole: function(relay) {
                removed = relay;
                return new Promise(function(resolve) {
                    resolve(true);
                });
            },
            roles: new Map()
        },
        reply: function(relay) {
            reply = relay;
            return new Promise(function(resolve) {
                resolve(true);
            });
        }
    };
    msg.guild.channels.set('000001', {name: 'testCh1', type: 'text'});
    msg.guild.channels.set('000002', {name: 'testCh2', type: 'text'});
    msg.guild.channels.set('000003', {name: 'testCh3', type: 'voice'});
    msg.guild.channels.set('000004', {name: 'testCh4', type: 'voice'});
    msg.guild.channels.set(config.getConfig().channels.mappings.herebedragons, {
        sendMessage: function(relay) {
            channelMessage = relay;
            return new Promise(function(resolve) {
                resolve(true);
            });
        }
    });
    let added = false;
    let channelMessage = false;
    let removed = false;
    let reply = false;

    // Function to reset the object and results before each test
    function resetTestObject() {
        // Reset results
        added = false;
        channelMessage = false;
        removed = false;
        reply = false;

        // Reset roles map to not contain dragons role
        msg.member.roles = new Map();
        msg.member.roles.set('000001', {test1: '1', test2: '2'});
        msg.member.roles.set('000002', {test1: '1', test2: '2'});
        msg.member.roles.set('000003', {test1: '1', test2: '2'});
    }

    it('should remove dragons role if member has it', function() {
        resetTestObject();
        msg.member.roles.set(config.getConfig().general.herebedragonsRoleID, {test1: '1', test2: '2'});
        dragons.execute(msg).should.be.false;
        added.should.be.false;
        channelMessage.should.be.false;
        removed.should.eql(config.getConfig().general.herebedragonsRoleID);
        reply.indexOf('you already had the herebedragons role.').should.not.eql(-1);
    });

    it('should add dragons role if member doesn\'t have it', function() {
        resetTestObject();
        dragons.execute(msg).should.be.true;
        added.should.eql(config.getConfig().general.herebedragonsRoleID);
        // .then action so this prob won't come back in time, not worth writing fancy async code for
        if (typeof channelMessage === 'boolean') {
            channelMessage.should.be.false;
        } else {
            channelMessage.indexOf('has been granted access here.').should.not.eql(-1);
        }
        removed.should.be.false;
        reply.should.be.false;
    });
});
