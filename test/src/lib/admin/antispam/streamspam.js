//  Copyright © 2018 DIG Development team. All rights reserved.s

const should = require('chai').should();

const config = require('../../../../../config/config.js');
const streamspam = require('../../../../../src/lib/admin/antispam/streamspam.js');

describe('admin/antispam/streamspam.js', function() {
    it('should have function execute', function() {
        streamspam.should.have.property('execute');
        streamspam.execute.should.be.a('function');
    });

    // Construct fake message object
    let msg = {
        channel: {
            id: '9867986986986',
            sendMessage: function(message) {
                result = message;
                return new Promise(function(resolve) {
                    resolve(true);
                });
            }
        },
        cleanContent: 'cleanTest',
        content: '',
        delete: function() {
            deleted = true;
        },
        guild: {
            channels: new Map(),
            id: config.getConfig().general.server,
        },
        member: {
            displayName: 'Dingbat',
            id: config.getConfig().general.server,
        }
    };
    let deleted = false;
    let result = false;
    let streamChannelMessage = false;
    const original = config.getConfig().streamChannel;
    const testChannel = '00000123';
    msg.guild.channels.set('00000001', {
        sendMessage: function() {
            streamChannelMessage = 'fail';
            return new Promise(function(resolve) {
                resolve(true);
            });
        }
    });
    msg.guild.channels.set('00000123', {
        sendMessage: function(relay) {
            streamChannelMessage = relay;
            return new Promise(function(resolve) {
                resolve(true);
            });
        }
    });
    msg.guild.channels.set('00000359', {
        sendMessage: function() {
            streamChannelMessage = 'fail';
            return new Promise(function(resolve) {
                resolve(true);
            });
        }
    });

    // Function to reset results and test object
    function resetTest() {
        config.setProperty('streamChannel', testChannel);
        deleted = false;
        result = false;
        streamChannelMessage = false;
        msg.content = '';
        msg.id = '9867986986986';
    }

    it('streamspam should not trigger when there is no stream', function() {
        resetTest();
        msg.content = 'Test message pls don\'t trigger on me';
        streamspam.execute(msg).should.be.true;
        deleted.should.be.false;
        result.should.be.false;
        streamChannelMessage.should.be.false;
        config.setProperty('streamChannel', original);
    });

    it('streamspam should not trigger on clips', function() {
        resetTest();
        // Test case of someone posting a twitch clip
        msg.content = 'Hey check out this clip https://www.twitch.tv/clips/117737476';
        streamspam.execute(msg).should.be.true;
        deleted.should.be.false;
        result.should.be.false;
        streamChannelMessage.should.be.false;
        config.setProperty('streamChannel', original);
    });

    it('streamspam should trigger on someone spamming a twitch stream', function() {
        resetTest();
        // Should be false to signal stream spamming is caught
        msg.content = 'Watch my stream guyz https://www.twitch.tv/117737476';
        streamspam.execute(msg).should.be.false;
        deleted.should.be.true;
        result.indexOf('we have a specific channel for streams').should.not.eql(-1);
        streamChannelMessage.should.eql('Dingbat: cleanTest');
        config.setProperty('streamChannel', original);
    });

    it('streamspam should trigger on someone spamming a hitbox stream', function() {
        resetTest();
        // Should be false to signal stream spamming is caught
        msg.content = 'Watch my stream guyz https://www.hitbox.tv/117737476';
        streamspam.execute(msg).should.be.false;
        deleted.should.be.true;
        result.indexOf('we have a specific channel for streams').should.not.eql(-1);
        streamChannelMessage.should.eql('Dingbat: cleanTest');
        config.setProperty('streamChannel', original);
    });

    it('streamspam should trigger on someone spamming a beam.pro stream', function() {
        resetTest();
        // Should be false to signal stream spamming is caught
        msg.content = 'Watch my stream guyz https://www.beam.pro/45373362';
        streamspam.execute(msg).should.be.false;
        deleted.should.be.true;
        result.indexOf('we have a specific channel for streams').should.not.eql(-1);
        streamChannelMessage.should.eql('Dingbat: cleanTest');
        config.setProperty('streamChannel', original);
    });

    it('should not trigger if someone is posting their stream in the stream channel', function() {
        resetTest();
        msg.content = 'Watch my stream guyz https://www.beam.pro/45373362';
        msg.channel.id = config.getConfig().streamChannel;
        streamspam.execute(msg).should.be.true;
        deleted.should.be.false;
        result.should.be.false;
        streamChannelMessage.should.be.false;
        config.setProperty('streamChannel', original);
    });
});
