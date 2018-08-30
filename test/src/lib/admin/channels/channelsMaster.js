//  Copyright © 2018 DIG Development team. All rights reserved.

const should = require('chai').should();

const channelsMaster = require('../../../../../src/lib/admin/channels/channelsMaster.js');

describe('admin/channels/channelsMaster.js', function() {
    it('should have function activityLog', function() {
        channelsMaster.should.have.property('activityLog');
        channelsMaster.activityLog.should.be.a('function');
    });

    it('should have function checkCreation', function() {
        channelsMaster.should.have.property('checkCreation');
        channelsMaster.checkCreation.should.be.a('function');
    });

    it('should have function checkPositions', function() {
        channelsMaster.should.have.property('checkPositions');
        channelsMaster.checkPositions.should.be.a('function');
    });

    it('should have function deleteInactive', function() {
        channelsMaster.should.have.property('deleteInactive');
        channelsMaster.deleteInactive.should.be.a('function');
    });

    // Configure channel and message objects for testing
    let channel = {
        delete: function() {
            deleted = true;
        },
        type: 'voice',
        members: {
            size: 0
        }
    };
    let msg = {
        channel: {
            sendMessage: function(input) {
                result = input;
                return new Promise(function(resolve) {
                    resolve(true);
                });
            },
        }
    };
    let deleted = false;
    let result = null;

    it('channelsMaster should want to delete inactive voice channel', function() {
        channel.type = 'voice';
        channel.members.size = 0;
        deleted = false;
        result = false;
        channelsMaster.deleteInactive(channel, msg).should.be.true;
        result.indexOf(' was succesfully deleted').should.not.eql(-1);
        deleted.should.be.true;
    });

    it('channelsMaster should not want to delete active voice channel', function() {
        channel.type = 'voice';
        channel.members.size = 2;
        deleted = false;
        result = false;
        channelsMaster.deleteInactive(channel, msg).should.be.false;
        result.indexOf('I can\'t delete a temporary').should.not.eql(-1);
        deleted.should.be.false;
    });

    it('channelsMaster should not want to delete a text channel with no messages', function() {
        channel.type = 'text';
        deleted = false;
        result = false;
        channelsMaster.deleteInactive(channel, msg);
        result.indexOf('I can\'t delete that channel').should.not.eql(-1);
        deleted.should.be.false;
    });

    it('should have function deleteChannel', function() {
        channelsMaster.should.have.property('deleteChannel');
    });

    it('should have function deleteInactive', function() {
        // Test to see if channels actually deleteInactive
        let channel = {
            delete: function() { success = true; }
        };
        let success = false;
        channelsMaster.deleteChannel(channel);
        success.should.be.true;
    });
});
