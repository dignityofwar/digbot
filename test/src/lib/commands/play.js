//  Copyright © 2018 DIG Development team. All rights reserved.

const should = require('chai').should();

const config = require('config');
const play = require('../../../../src/lib/commands/play.js');

describe('commands/play.js', function() {
    it('should have function execute', function() {
        play.should.have.property('execute');
        play.execute.should.be.a('function');
    });

    // Store original variable, to set it back after testing is finished
    const original = config.get('features');
    let features = original;

    // Build fake message object for testing
    let message = {
        content: '!play',
        channel: {
            sendMessage: function(result) {
                channelMessage = result;
                return new Promise(function(resolve) {
                    resolve(true);
                });
            }
        }
    };
    let channelMessage = false;

    it('should let user know if feature disabled', function() {
        channelMessage = false;
        features.play = false;
        config.setProperty('features', features);
        play.execute(message).should.eql(false);
        channelMessage.indexOf('this feature has been disabled').should.not.eql(-1);
        config.setProperty('features', original);
    });

    it('should let user know if command not complete', function() {
        message.content = '!play';
        channelMessage = false;
        features.play = true;
        config.setProperty('features', features);
        play.execute(message).should.eql(false);
        channelMessage.indexOf('provide a valid command.').should.not.eql(-1);
        config.setProperty('features', original);
    });

    it('should return false if member not in voice channel', function() {
        message.content = '!play video dQw4w9WgXcQ';
        message.member = {voiceChannel: false};
        channelMessage = false;
        features.play = true;
        config.setProperty('features', features);
        play.execute(message).should.eql(false);
        channelMessage.should.eql('Please be in a voice channel first!');
        config.setProperty('features', original);
    });

    it('should refuse to play videos if ID isn\'t correctly provided', function() {
        message.content = '!play video http://dQw4w9WgXcQ';
        message.member = {voiceChannel: '456573753735'};
        channelMessage = false;
        features.play = true;
        config.setProperty('features', features);
        play.execute(message).should.eql(false);
        channelMessage.indexOf('(the ID after watch?v= in the url)').should.not.eql(-1);
        config.setProperty('features', original);

        message.content = '!play video youtube.com/watch?v=dQw4w9WgXcQ';
        message.member = {voiceChannel: '456573753735'};
        channelMessage = false;
        features.play = true;
        config.setProperty('features', features);
        play.execute(message).should.eql(false);
        channelMessage.indexOf('(the ID after watch?v= in the url)').should.not.eql(-1);
        config.setProperty('features', original);

        message.content = '!play video dQw4w9WgXcQ&time=43s';
        message.member = {voiceChannel: '456573753735'};
        channelMessage = false;
        features.play = true;
        config.setProperty('features', features);
        play.execute(message).should.eql(false);
        channelMessage.indexOf('(the ID after watch?v= in the url)').should.not.eql(-1);
        config.setProperty('features', original);
    });

    it('should accept correctly formatted video request', function() {
        message.content = '!play video dQw4w9WgXcQ';
        message.member = {voiceChannel: '456573753735'};
        channelMessage = false;
        features.play = true;
        config.setProperty('features', features);
        play.execute(message).should.be.true;
        channelMessage.should.be.false;
        config.setProperty('features', original);
    });

    it('should refuse to play playlists if ID isn\'t correctly provided', function() {
        message.content = '!play playlist http://dQw4w9WgXcrehe4Q';
        message.member = {voiceChannel: '456573753735'};
        channelMessage = false;
        features.play = true;
        config.setProperty('features', features);
        play.execute(message).should.eql(false);
        channelMessage.indexOf('(the ID after playlist?list= in the url)').should.not.eql(-1);
        config.setProperty('features', original);

        message.content = '!play playlist video?v=dQw4w9WgXcQ&list=643086092487092dfmoi';
        message.member = {voiceChannel: '456573753735'};
        channelMessage = false;
        features.play = true;
        config.setProperty('features', features);
        play.execute(message).should.eql(false);
        channelMessage.indexOf('(the ID after playlist?list= in the url)').should.not.eql(-1);
        config.setProperty('features', original);

        message.content = '!play playlist 555534-u-gmksem5/fpojiop40-0';
        message.member = {voiceChannel: '456573753735'};
        channelMessage = false;
        features.play = true;
        config.setProperty('features', features);
        play.execute(message).should.eql(false);
        channelMessage.indexOf('(the ID after playlist?list= in the url)').should.not.eql(-1);
        config.setProperty('features', original);
    });

    it('should accept correctly formatted local playlist request', function() {
        message.content = '!play playlist nightcore';
        message.member = {voiceChannel: '456573753735'};
        channelMessage = false;
        features.play = true;
        config.setProperty('features', features);
        play.execute(message).should.be.true;
        channelMessage.indexOf('Now playing *nightcore* playlist').should.not.eql(-1);
        config.setProperty('features', original);
    });

    it('should accept correctly formatted youtube ID playlist request', function() {
        message.content = '!play playlist 4096094jgkdnsldkotji04piw0dnjg';
        message.member = {voiceChannel: '456573753735'};
        channelMessage = false;
        features.play = true;
        config.setProperty('features', features);
        play.execute(message).should.be.true;
        channelMessage.should.be.false;
        config.setProperty('features', original);
    });

    it('should not end playback if no playback in channel', function() {
        message.content = '!play stop';
        message.member = {voiceChannel: '456573753735'};
        channelMessage = false;
        features.play = true;
        config.setProperty('features', features);
        play.execute(message).should.be.false;
        channelMessage.indexOf('appear to be any songs playing in your channel').should.not.eql(-1);
        config.setProperty('features', original);
    });

    it('should not be able to skip if no songs in channel', function() {
        message.content = '!play skip';
        message.member = {voiceChannel: '456573753735'};
        channelMessage = false;
        features.play = true;
        config.setProperty('features', features);
        play.execute(message).should.be.false;
        channelMessage.indexOf('appear to be any songs playing in your channel').should.not.eql(-1);
        config.setProperty('features', original);
    });

    it('should require valid volume adjustment parameter', function() {
        message.content = '!play volume sideways';
        message.member = {voiceChannel: '456573753735'};
        channelMessage = false;
        features.play = true;
        config.setProperty('features', features);
        play.execute(message).should.be.false;
        channelMessage.indexOf('recognise that specification, please use').should.not.eql(-1);
        config.setProperty('features', original);
    });

    it('should not be able to adjust volume if no songs in channel', function() {
        message.content = '!play volume up';
        message.member = {voiceChannel: '456573753735'};
        channelMessage = false;
        features.play = true;
        config.setProperty('features', features);
        play.execute(message).should.be.false;
        channelMessage.indexOf('appear to be any songs playing in your channel').should.not.eql(-1);
        config.setProperty('features', original);
    });

    it('should have function passList', function() {
        play.should.have.property('passList');
        play.passList.should.be.a('function');
    });

    it('passList() should return false if feature disabled', function() {
        features.play = false;
        config.setProperty('features', features);
        play.passList().should.be.false;
        config.setProperty('features', original);
    });

    it('passList() should return type string', function() {
        features.play = true;
        config.setProperty('features', features);
        play.passList().should.be.a('string');
        config.setProperty('features', original);
    });

    it('passList() should return explanation of command', function() {
        features.play = true;
        config.setProperty('features', features);
        play.passList().indexOf('__**Play Command:**__').should.not.eql(-1);
        config.setProperty('features', original);
    });

    it('should have function ready', function() {
        play.should.have.property('ready');
        play.ready.should.be.a('function');
    });
});
