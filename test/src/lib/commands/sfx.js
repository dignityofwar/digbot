//  Copyright © 2018 DIG Development team. All rights reserved.

const should = require('chai').should();

const config = require('../../../../config/config.js');
const sfx = require('../../../../src/lib/commands/sfx.js');

describe('commands/sfx.js', function() {
    it('should have function execute', function() {
        sfx.should.have.property('execute');
        sfx.execute.should.be.a('function');
    });

    // Store original variable, to set it back after testing is finished
    const original = config.getConfig().features;
    let features = original;

    // Build fake message object for testing
    let message = {
        author: {
            sendMessage: function(result) {
                userMessage = result;
                return new Promise(function(resolve) {
                    resolve(true);
                });
            }
        },
        content: '!sfx',
        channel: {
            sendMessage: function(result) {
                channelMessage = result;
                return new Promise(function(resolve) {
                    resolve(true);
                });
            }
        },
        delete: function() {
            deleted = true;
            return new Promise(function(resolve) {
                resolve(true);
            });
        },
        member: {
            displayName: 'JBuilds'
        }
    };
    let channelMessage = false;
    let deleted = false;
    let userMessage = false;

    function resetTest() {
        message.content = '!sfx';
        features.sfx = true;
        config.setProperty('features', features);
        channelMessage = false;
        deleted = false;
        userMessage = false;
    }

    it('should have function execute', function() {
        sfx.should.have.property('execute');
        sfx.execute.should.be.a('function');
    });

    it('should let user know if feature disabled', function() {
        resetTest();
        features.sfx = false;
        config.setProperty('features', features);
        sfx.execute(message).should.eql(false);
        config.setProperty('features', original);
        channelMessage.should.eql('Sorry this feature has been disabled');
        userMessage.should.eql(false);
        deleted.should.eql(false);
    });

    it('should let user know if no target specified', function() {
        resetTest();
        message.content = '!sfx';
        sfx.execute(message).should.eql(false);
        config.setProperty('features', original);
        channelMessage.should.eql('Please provide an sfx to play. E.g. !sfx cena');
        userMessage.should.eql(false);
        deleted.should.eql(false);
    });

    it('should provide full list of available sfx', function() {
        resetTest();
        message.content = '!sfx list';
        sfx.execute(message).should.eql(false);
        config.setProperty('features', original);
        channelMessage.should.eql('I\'ll PM you the full list of sound effects JBuilds');
        userMessage.indexOf('__Full list of available sound effects__: ').should.eql(0);
        deleted.should.eql(false);
    });

    it('should let user know if they attempt to call and sfx that doesn\'t exist', function() {
        resetTest();
        message.content = '!sfx notARealSFXProperty';
        sfx.execute(message).should.eql(false);
        config.setProperty('features', original);
        channelMessage.should.eql('Sorry I don\'t recognise that sound effect');
        userMessage.should.be.false;
        deleted.should.eql(false);
    });

    it('should let user know they must be in a voice channel to use sfx', function() {
        resetTest();
        message.content = '!sfx wow';
        sfx.execute(message).should.eql(false);
        config.setProperty('features', original);
        channelMessage.should.eql('Please be in a voice channel first!');
        userMessage.should.be.false;
        deleted.should.eql(false);
    });

    describe('should attempt to play sfx given a correct command', function() {
        let channelMessageArray = [];

        before(function(done) {
            resetTest();
            message.content = '!sfx wow';
            message.member.voiceChannel = {members: {size: 3}};
            message.channel.name = 'not a real channel';
            message.channel.sendMessage = function(result) {
                channelMessageArray.push(result);
                return new Promise(function(resolve) {
                    resolve(true);
                });
            };
            sfx.execute(message);
            const start = setTimeout(done, 50); // Longer timer to wait on verification
        });

        /*it('should attempt to play sfx given a correct command', function() {
            channelMessageArray[0].should.eql('Playing effect: *wow* for JBuilds');
            channelMessageArray[1].should.eql('Sorry, the sfx encountered an error, please try again.');
            userMessage.should.be.false;
            deleted.should.eql(true);
        });*/
    });

    it('should have function ready', function() {
        sfx.should.have.property('ready');
        sfx.ready.should.be.a('function');
    });
});
