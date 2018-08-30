//  Copyright © 2018 DIG Development team. All rights reserved.

const should = require('chai').should();

const channel = require('../../../../src/lib/commands/channel.js');

describe('commands/channel.js', function() {
    it('should have function execute', function() {
        channel.should.have.property('execute');
        channel.execute.should.be.a('function');
    });

    // Build fake message object for testing
    let msg = {
        channel: {
            sendMessage: function(relay) {
                channelMessage = relay;
                return new Promise(function(resolve) {
                    resolve(true);
                });
            }
        },
        content: '',
        guild: {
            channels: new Map(),
            createChannel: function(relay) {
                channelCreated = relay;
                return new Promise(function(resolve) {
                    resolve(true);
                });
            },
            defaultChannel: {
                clone: function(relay) {
                    channelCreated = relay;
                    return new Promise(function(resolve) {
                        resolve(true);
                    });
                }
            }
        }
    };
    msg.guild.channels.set('000001', {name: 'testCh1', type: 'text'});
    msg.guild.channels.set('000002', {name: 'testCh2', type: 'text'});
    msg.guild.channels.set('000003', {name: 'testCh3', type: 'voice'});
    msg.guild.channels.set('000004', {name: 'testCh4', type: 'voice'});
    msg.guild.channels.set('000005', {name: 'pre-existing-channel-t-', type: 'text'});
    msg.guild.channels.set('000006', {name: '⏳ pre existing channel-t-', type: 'voice'});
    let channelMessage = '';
    let channelCreated = false;

    // Function to reset the object and results before each test
    function resetTestObject() {
        msg.content = '';
        channelMessage = '';
        channelCreated = false;
    }

    it('should not accept a command of length shorter than 9', function() {
        resetTestObject();
        msg.content = '!channel';
        channel.execute(msg).should.be.false;
        channelMessage.indexOf('This command will always be of the form !ch').should.not.eql(-1);
        channelCreated.should.be.false;
    });

    it('should not accept a command with an invalid action', function() {
        resetTestObject();
        msg.content = '!channel randomgibberish';
        channel.execute(msg).should.be.false;
        channelMessage.indexOf('Sorry I don\'t understand that action, the ac').should.not.eql(-1);
        channelCreated.should.be.false;
    });

    it('should not accept a command with an invalid type', function() {
        resetTestObject();
        msg.content = '!channel create randomgibberish';
        channel.execute(msg).should.be.false;
        channelMessage.indexOf('Sorry I don\'t understand that type, the type mu').should.not.eql(-1);
        channelCreated.should.be.false;

    });

    it('should not accept a non alphanumeric name for creation', function() {
        resetTestObject();
        msg.content = '!channel create text []23#8^*';
        channel.execute(msg).should.be.false;
        channelMessage.indexOf('channel names have to be alphanumeric.').should.not.eql(-1);
        channelCreated.should.be.false;
        resetTestObject();
        msg.content = '!channel create voice []23#8^*';
        channel.execute(msg).should.be.false;
        channelMessage.indexOf('channel names have to be alphanumeric.').should.not.eql(-1);
        channelCreated.should.be.false;
    });

    it('should not accept a name with symbols added by a user', function() {
        resetTestObject();
        msg.content = '!channel create voice 🎮  PS2/DIGT/1';
        channel.execute(msg).should.be.false;
        channelMessage.indexOf('channel names have to be alphanumeric.').should.not.eql(-1);
        channelCreated.should.be.false;
        resetTestObject();
        msg.content = '!channel create voice ⏳ WOW';
        channel.execute(msg).should.be.false;
        channelMessage.indexOf('channel names have to be alphanumeric.').should.not.eql(-1);
        channelCreated.should.be.false;
    });

    it('should not accept a name shorter than 2 characters', function() {
        resetTestObject();
        msg.content = '!channel create text ForATRAAAAAAAAAAAAAAAAAAAAAAAAA' +
        'AAAAAAAAAAAAAAAAAbreathAAAAAAAAAAAAAAAAAAAAAAAAAAAA' +
        'AAAAAAAAAAAAAAAAAAAA';
        channel.execute(msg).should.be.false;
        channelMessage.indexOf('between 2 and 100 characters in length.').should.not.eql(-1);
        channelCreated.should.be.false;
    });

    it('should not accept the name of a prexisting channel', function() {
        // --- Text cases ---
        // Exact match
        resetTestObject();
        msg.content = '!channel create text pre-existing-channel-t-';
        channel.execute(msg).should.be.false;
        channelMessage.indexOf('have a temporary channel by that name').should.not.eql(-1);
        channelCreated.should.be.false;
        // Exact name match
        resetTestObject();
        msg.content = '!channel create text pre-existing-channel';
        channel.execute(msg).should.be.false;
        channelMessage.indexOf('have a temporary channel by that name').should.not.eql(-1);
        channelCreated.should.be.false;
        // Name match with spaces
        resetTestObject();
        msg.content = '!channel create text pre existing channel';
        channel.execute(msg).should.be.false;
        channelMessage.indexOf('have a temporary channel by that name').should.not.eql(-1);
        channelCreated.should.be.false;
        // Name match with spaces plus suffix
        resetTestObject();
        msg.content = '!channel create text pre existing channel-t-';
        channel.execute(msg).should.be.false;
        channelMessage.indexOf('have a temporary channel by that name').should.not.eql(-1);
        channelCreated.should.be.false;
        // --- Voice cases ---
        // Exact match
        resetTestObject();
        msg.content = '!channel create voice pre existing channel-t-';
        channel.execute(msg).should.be.false;
        channelMessage.indexOf('have a temporary channel by that name').should.not.eql(-1);
        channelCreated.should.be.false;
        // Name without suffix
        resetTestObject();
        msg.content = '!channel create voice pre existing channel';
        channel.execute(msg).should.be.false;
        channelMessage.indexOf('have a temporary channel by that name').should.not.eql(-1);
        channelCreated.should.be.false;
    });

    it('should create text channels', function() {
        resetTestObject();
        msg.content = '!channel create text boombastic';
        channel.execute(msg).should.be.true;
        channelMessage.should.eql('The text channel boombastic-t- has been created');
        channelCreated.should.eql('boombastic-t-');
        resetTestObject();
        msg.content = '!channel create text test spaces here';
        channel.execute(msg).should.be.true;
        channelMessage.should.eql('The text channel test-spaces-here-t- has been created');
        channelCreated.should.eql('test-spaces-here-t-');
    });

    it('should create voice channels', function() {
        resetTestObject();
        msg.content = '!channel create voice boombastic';
        channel.execute(msg).should.be.true;
        channelMessage.should.eql('The voice channel ⏳ boombastic-t- has been created');
        channelCreated.should.eql('⏳ boombastic-t-');
        resetTestObject();
        msg.content = '!channel create voice test spaces here';
        channel.execute(msg).should.be.true;
        channelMessage.should.eql('The voice channel ⏳ test spaces here-t- has been created');
        channelCreated.should.eql('⏳ test spaces here-t-');
    });

    it('should not attempt to delete non existent channels', function() {
        resetTestObject();
        msg.content = '!channel delete text not-a-channel-t-';
        channel.execute(msg).should.be.false;
        channelMessage.indexOf('Sorry I couldn\'t find a deletable channel by tha').should.not.eql(-1);
        channelCreated.should.be.false;
        resetTestObject();
        msg.content = '!channel delete text not a channel';
        channel.execute(msg).should.be.false;
        channelMessage.indexOf('Sorry I couldn\'t find a deletable channel by tha').should.not.eql(-1);
        channelCreated.should.be.false;
        resetTestObject();
        msg.content = '!channel delete voice not a channel';
        channel.execute(msg).should.be.false;
        channelMessage.indexOf('Sorry I couldn\'t find a deletable channel by tha').should.not.eql(-1);
        channelCreated.should.be.false;
    });
});
