//  Copyright © 2018 DIG Development team. All rights reserved.

const should = require('chai').should();

const DM = require('../../../../src/lib/discord/direct-message.js');

describe('discord/direct-message.js', function() {
    let msg = {
        author: {username: 'JBuilds'},
        content: '',
        reply: function(relay) {
            reply = relay;
            return new Promise(function(resolve) {
                resolve(message);
            });
        },
    };
    let reply = false;

    beforeEach(function() {
        reply = false;
    });

    it('should have the function "handle"', function() {
        DM.should.have.property('handle');
        DM.handle.should.be.a('function');
    });

    it('should have no command case', function() {
        msg.content = 'Hey';
        DM.handle(msg).should.be.true;
        reply.indexOf('Hey, thanks for contacting DIGBot. You should know').should.eql(0);
    });

    it('should recognise messages to staff', function() {
        msg.content = '!staff hey';
        DM.handle(msg).should.be.true;
        reply.indexOf('Thanks, I\'ll pass your message onto the staff, please be sure yo').should.eql(0);
    });

    it('should recognise messages to devs', function() {
        msg.content = '!developers hey';
        DM.handle(msg).should.be.true;
        reply.indexOf('Thanks, I\'ll pass your message onto the devs, please be ').should.eql(0);
    });

    it('should recognise empty messages to staff', function() {
        msg.content = '!staff';
        DM.handle(msg).should.be.false;
        reply.indexOf('Please make sure you type us a message, or we don\'t know wh').should.eql(0);
    });

    it('should recognise empty messages to staff', function() {
        msg.content = '!developers';
        DM.handle(msg).should.be.false;
        reply.indexOf('Please make sure you type us a message, or we don\'t know wh').should.eql(0);
    });

    it('should have the function "handleEmptyMessage"', function() {
        DM.should.have.property('handleEmptyMessage');
        DM.handleEmptyMessage.should.be.a('function');
    });
});
