//  Copyright © 2018 DIG Development team. All rights reserved.

const should = require('chai').should();

const stats = require('../../../../src/lib/commands/stats.js');

/* Some stats functionality either just too reliant on other modules or just don't make sense to test, these are:
- cpu/memory (if the test goes wrong could easily crash the server)
- runtime
- connection stability
- members on server
- members ingame
*/
describe('commands/stats.js', function() {
    it('should have function filter', function() {
        stats.should.have.property('execute');
        stats.execute.should.be.a('function');
    });

    const now = Date.now();
    let msg = {};
    let secondMessage = {};
    let channelMessage = false;
    let editResult = [];

    function resetTest() {
        msg = {
            channel: {
                sendMessage: function(relay) {
                    channelMessage = relay;
                    return new Promise(function(resolve) {
                        resolve(secondMessage);
                    });
                }
            },
            createdTimestamp: now
        };
        secondMessage = {
            createdTimestamp: now + 55,
            edit: function(relay) {
                editResult.push(relay);
                return new Promise(function(resolve) {
                    resolve(true);
                });
            }
        };
        channelMessage = false;
        editResult = [];
    }

    it('should have function execute', function() {
        stats.should.have.property('execute');
        stats.execute.should.be.a('function');
    });

    it('execute should immidiately return the message "pong" to be eddited', function() {
        resetTest();
        stats.execute(msg).should.be.true;
        channelMessage.should.eql('pong');
    });

    describe('test edit', function() {
        beforeEach(function(done) {
            resetTest();
            stats.execute(msg);
            const start = setTimeout(done, 5);
        });

        it('stats should succesfully edit the message', function() {
            channelMessage.should.eql('pong');
            editResult.should.be.a('array');
            editResult.length.should.eql(1);
            editResult[0].should.be.a('string');
        });

        it('stats should contain information on relevent metrics', function() {
            editResult[0].indexOf('__**DIGBot Stats**__').should.eql(0);
            editResult[0].indexOf('**Version:**').should.not.eql(-1);
            editResult[0].indexOf('**Ping:**').should.not.eql(-1);
            editResult[0].indexOf('**CPU Usage:**').should.not.eql(-1);
            editResult[0].indexOf('**Memory Usage:**').should.not.eql(-1);
            editResult[0].indexOf('**Runtime:**').should.not.eql(-1);
            editResult[0].indexOf('**Stable Discord connection for:**').should.not.eql(-1);
            editResult[0].indexOf('__**Community Stats**__').should.not.eql(-1);
            editResult[0].indexOf('**Members on server:**').should.not.eql(-1);
            editResult[0].indexOf('**Server members in-game:**').should.not.eql(-1);
        });
    });

    describe('test timestamps', function() {

        // Need custom vars as multiple asynchorous tests using the same vars will conflict
        const timestampMessage = {
            channel: {
                sendMessage: function(relay) {
                    timestampChannelMessage = relay;
                    return new Promise(function(resolve) {
                        resolve(timestampMessage2);
                    });
                }
            },
            createdTimestamp: now
        };
        let timestampMessage2 = {
            createdTimestamp: now + 55,
            edit: function(relay) {
                timestampEditResult.push(relay);
                return new Promise(function(resolve) {
                    resolve(true);
                });
            }
        };
        let timestampEditResult = [];
        let timestampChannelMessage = false;

        beforeEach(function(done) {
            // Setup
            timestampEditResult = [];
            timestampChannelMessage = false;
            timestampMessage2.createdTimestamp = now + 55;

            // Gather results to test
            stats.execute(timestampMessage);
            const second = setTimeout(function() {
                timestampMessage2.createdTimestamp = now + 150;
                stats.execute(timestampMessage);
            }, 5);
            const third = setTimeout(function() {
                timestampMessage2.createdTimestamp = now + 300;
                stats.execute(timestampMessage);
            }, 10);
            const fourth = setTimeout(function() {
                timestampMessage2.createdTimestamp = now + 600;
                stats.execute(timestampMessage);
            }, 15);
            const fifth = setTimeout(function() {
                timestampMessage2.createdTimestamp = now + 1500;
                stats.execute(timestampMessage);
            }, 20);
            const start = setTimeout(done, 25);
        });

        it('stats should show pingtime calculated of message timestamps', function() {
            timestampEditResult[0].indexOf('**Ping:** 55ms (Excellent)').should.not.eql(-1);
            timestampEditResult[1].indexOf('**Ping:** 150ms (Very Good)').should.not.eql(-1);
            timestampEditResult[2].indexOf('**Ping:** 300ms (Good)').should.not.eql(-1);
            timestampEditResult[3].indexOf('**Ping:** 600ms (Mediocre)').should.not.eql(-1);
            timestampEditResult[4].indexOf('**Ping:** 1500ms (Bad)').should.not.eql(-1);
        });
    });
});
