//  Copyright © 2018 DIG Development team. All rights reserved.

const should = require('chai').should();

const ping = require('../../../../src/lib/commands/ping.js');

describe('commands/ping.js', function() {
    const now = new Date();
    const msg = {
        channel: {
            sendMessage: function(relay) {
                channelMessage = relay;
                return new Promise(function(resolve) {
                    resolve(message);
                });
            }
        },
        createdTimestamp: now.getTime(),
        member: {
            displayName: 'JBuilds'
        }
    };
    let message = {
        createdTimestamp: now.getTime() + 10,
        edit: function(relay) {
            result.push(relay);
            return new Promise(function(resolve) {
                resolve(true);
            });
        }
    };
    let channelMessage = false;
    let result = [];

    before(function(done) {
        message.createdTimestamp = now.getTime() + 10;
        ping.execute(msg);
        let second = setTimeout(function() {
            message.createdTimestamp = now.getTime() + 75;
            ping.execute(msg);
        }, 1);
        let third = setTimeout(function() {
            message.createdTimestamp = now.getTime() + 200;
            ping.execute(msg);
        }, 2);
        let fourth = setTimeout(function() {
            message.createdTimestamp = now.getTime() + 450;
            ping.execute(msg);
        }, 3);
        let fifth = setTimeout(function() {
            message.createdTimestamp = now.getTime() + 1050;
            ping.execute(msg);
        }, 4);
        let complete = setTimeout(done, 5); // Give promises time to execute
    });

    it('should have function execute', function() {
        ping.should.have.property('execute');
        ping.execute.should.be.a('function');
    });

    it('test results should be in', function() {
        channelMessage.should.eql('pong');
        result.length.should.eql(5);
    });

    it('should show excellent ping', function() {
        result[0].should.eql('Ping: 10ms (Excellent)');
    });

    it('should show very good ping', function() {
        result[1].should.eql('Ping: 75ms (Very Good)');
    });

    it('should show good ping', function() {
        result[2].should.eql('Ping: 200ms (Good)');
    });

    it('should show mediocre ping', function() {
        result[3].should.eql('Ping: 450ms (Mediocre)');
    });

    it('should show bad ping', function() {
        result[4].should.eql('Ping: 1050ms (Bad)');
    });
});
