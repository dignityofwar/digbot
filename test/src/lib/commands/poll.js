//  Copyright © 2018 DIG Development team. All rights reserved.

const should = require('chai').should();
const sinon = require('sinon');

const poll = require('../../../../src/lib/commands/poll.js');

describe('commands/poll.js', function() {

    let msg = {
        author: {
            id: '000001'
        },
        channel: {
            id: '000001'
        },
        content: '!poll',
        member: {
            displayName: 'JBuilds'
        },
        reply: function(result) {
            reply = result;
            return new Promise(function(resolve) {
                resolve(true);
            });
        }
    };
    let reply = false;

    function resetTest() {
        msg.content = '!poll';
        msg.author.id = '0000001';
        msg.channel.id = (Math.floor(Math.random() * 1000000)).toString(); // Avoid repeating channel IDs
        reply = false;
    }

    it('should have function check', function() {
        poll.should.have.property('check');
        poll.check.should.be.a('function');
    });

    it('check should recognise when polls are due to end automatically', function() {
        resetTest();
        const clock = sinon.useFakeTimers();
        msg.content = '!poll do you like cats?';
        poll.execute(msg);
        poll.check().should.be.false;
        reply.should.be.false;
        clock.tick(100000);
        poll.check().should.be.false;
        reply.should.be.false;
        clock.tick(300001);
        poll.check().should.be.true;
        reply.indexOf('**Poll Ended!**\n__Question:__ do you like cats?').should.eql(0);
        clock.restore();
    });

    it('should have function execute', function() {
        poll.should.have.property('execute');
        poll.execute.should.be.a('function');
    });

    it('should let user know that the poll must contain a question', function() {
        resetTest();
        msg.content = '!poll do you like cats';
        poll.execute(msg).indexOf('You must use a question mark (?) at the e').should.not.eql(-1);
        reply.should.be.false;
    });

    it('should let user know that the poll must contain only one question', function() {
        resetTest();
        msg.content = '!poll do you like cats? Also.... How much does K0per1s annoy you?';
        poll.execute(msg).indexOf('You may only use one question mark in the ').should.not.eql(-1);
        reply.should.be.false;
    });

    it('should let user know they must format the command correctly', function() {
        resetTest();
        msg.content = '!poll do you like cats?hhhh';
        poll.execute(msg).indexOf('Please check you have formatted the comm').should.not.eql(-1);
        reply.should.be.false;
    });

    it('should let user know they must format the poll\'s options correctly', function() {
        resetTest();
        msg.content = '!poll do you like cats? [,]';
        poll.execute(msg).indexOf('It looks like one of your options is blank [yes').should.not.eql(-1);
        reply.should.be.false;
        resetTest();
        msg.content = '!poll do you like cats? [yes, no,]';
        poll.execute(msg).indexOf('It looks like one of your options is blank [yes').should.not.eql(-1);
        reply.should.be.false;
        resetTest();
        msg.content = '!poll do you like cats? [yes, ,no]';
        poll.execute(msg).indexOf('It looks like one of your options is blank [yes').should.not.eql(-1);
        reply.should.be.false;
    });

    it('should let user know if they are trying to end a non existent vote', function() {
        resetTest();
        msg.content = '!poll x';
        poll.execute(msg).indexOf('There does not seem to currently be an ongo').should.not.eql(-1);
        reply.should.be.false;
    });

    it('should let user know they can\'t end a vote someone else started', function() {
        resetTest();
        // Don't ask, I have no answers for you, it just needs to happen
        const test1 = {
            author: {
                id: '0000000000002'
            },
            channel: {
                id: '000001'
            },
            content: '!poll do you like cats?',
            member: {
                displayName: 'JBuilds'
            },
            reply: function(result) {
                reply = result;
                return new Promise(function(resolve) {
                    resolve(true);
                });
            }
        };
        const test2 = {
            author: {
                id: '000000000001'
            },
            channel: {
                id: '000001'
            },
            content: '!poll x',
            member: {
                displayName: 'JBuilds'
            },
            reply: function(result) {
                reply = result;
                return new Promise(function(resolve) {
                    resolve(true);
                });
            }
        };
        poll.execute(test1).should.be.a('string');
        reply.should.be.false;
        poll.execute(test2).indexOf('Sorry JBuilds, votes can only be ended early').should.not.eql(-1);
        reply.should.be.false;
    });

    it('should end polls on request (no vote case)', function() {
        resetTest();
        msg.content = '!poll do you like cats?';
        poll.execute(msg).should.be.a('string');
        msg.content = '!poll x';
        const result = poll.execute(msg);
        result.indexOf('And not a single vote was cast this day.').should.not.eql(-1);
        result.indexOf('**Poll Ended!**').should.not.eql(-1);
        reply.should.be.false;
    });

    it('should end polls on request (1 vote case)', function() {
        resetTest();
        msg.content = '!poll do you like cats?';
        poll.execute(msg);
        msg.content = '!vote yes';
        poll.vote(msg);
        msg.content = '!poll x';
        const result = poll.execute(msg);
        result.indexOf('And not a single vote was cast this day.').should.eql(-1);
        result.indexOf('**Poll Ended!**').should.not.eql(-1);
        reply.should.be.false;
    });

    it('should not allow a poll to start if one is still ongoing', function() {
        resetTest();
        msg.content = '!poll do you like cats?';
        poll.execute(msg).indexOf('**Poll Started!**').should.eql(0);
        poll.execute(msg).indexOf('Sorry there is already an ongoing po').should.not.eql(-1);
        reply.should.be.false;
    });

    it('should not allow unreasonably short questions', function() {
        resetTest();
        msg.content = '!poll cats?';
        poll.execute(msg).should.eql('Error: Questions must be longer than 8 characters long.');
        reply.should.be.false;
    });

    it('should correctly set up poll (non multiple choice)', function() {
        resetTest();
        msg.content = '!poll how many times should ATRA warpgate TR a day?';
        poll.execute(msg).indexOf('**Poll Started!**: *how many times should ATR').should.eql(0);
        reply.should.be.false;
        resetTest();
        msg.content = '!poll should DIGBot go on a banning spree?';
        const result = poll.execute(msg);
        result.indexOf('**Poll Started!**: *should DIGBot go on a bann').should.eql(0);
        result.indexOf('Options:').should.eql(-1);
        reply.should.be.false;
    });

    it('should correctly set up poll (multiple choice)', function() {
        resetTest();
        msg.content = '!poll how many times should ATRA warpgate TR a day? [2 Times, 3 Times]';
        const result1 = poll.execute(msg);
        result1.indexOf('**Poll Started!**: *how many times should ATR').should.eql(0);
        result1.indexOf('Options').should.not.eql(-1);
        result1.indexOf('2 Times').should.not.eql(-1);
        reply.should.be.false;
        resetTest();
        msg.content = '!poll how many noobs should DIGBot ban? [3, 10, All]';
        const result2 = poll.execute(msg);
        result2.indexOf('**Poll Started!**: *how many noobs should DIGBot ban? [').should.eql(0);
        result2.indexOf('Options').should.not.eql(-1);
        result2.indexOf('3').should.not.eql(-1);
        result2.indexOf('10').should.not.eql(-1);
        result2.indexOf('All').should.not.eql(-1);
        reply.should.be.false;
    });

    it('should correctly set up poll (default multiple choice)', function() {
        resetTest();
        msg.content = '!poll do you like cats? []';
        const result = poll.execute(msg);
        result.indexOf('**Poll Started!**: *do you like cats?').should.eql(0);
        result.indexOf('Options: yes, no, abstain').should.not.eql(-1);
        reply.should.be.false;
        // Test with space
        resetTest();
        msg.content = '!poll do you like cats? [   ]';
        const result2 = poll.execute(msg);
        result2.indexOf('**Poll Started!**: *do you like cats?').should.eql(0);
        result2.indexOf('Options: yes, no, abstain').should.not.eql(-1);
        reply.should.be.false;
    });

    it('should have function vote', function() {
        poll.should.have.property('vote');
        poll.vote.should.be.a('function');
    });

    it('should not allow vote if no poll in channel', function() {
        resetTest();
        msg.content = '!vote Trump';
        poll.vote(msg).indexOf('There currently isn\'t a vote ongoing in this chan').should.not.eql(-1);
        reply.should.be.false;
    });

    it('should not allow users to vote multiple times in the same poll', function() {
        resetTest();
        msg.content = '!poll when will the website be running?';
        poll.execute(msg).indexOf('**Poll Started!**: *when will the website be ').should.not.eql(-1);
        msg.content = '!vote 2017!';
        poll.vote(msg).should.eql('Thanks for voting JBuilds.');
        msg.content = '!vote never, are you kidding me? We\'ve got a 2.5 man dev team';
        poll.vote(msg).should.eql('Your vote has already been counted JBuilds.');
        reply.should.be.false;
    });

    it('should not allow users to cast a blank vote', function() {
        resetTest();
        msg.content = '!poll are we seriously going to test every bloody thing this module does?';
        poll.execute(msg).indexOf('**Poll Started!**: *are we seriously going ').should.not.eql(-1);
        msg.content = '!vote';
        poll.vote(msg).indexOf('You need to say what you\'re voting for ').should.eql(0);
        msg.content = '!vote ';
        poll.vote(msg).indexOf('You need to say what you\'re voting for ').should.eql(0);
        reply.should.be.false;
    });

    it('should not allow users to cast a random vote in a multiple choice poll', function() {
        resetTest();
        msg.content = '!poll what star wars movie was the best? [4, 5, 6, 7]';
        poll.execute(msg).indexOf('**Poll Started!**: *what star wars movie was').should.not.eql(-1);
        msg.content = '!vote 1';
        poll.vote(msg).indexOf('Sorry JBuilds, this is a multiple choice poll, acceptable').should.eql(0);
        reply.should.be.false;
    });

    it('should filter near-same answers in non multiple choice polls', function() {
        // Affermative case
        resetTest();
        msg.content = '!poll these tests are great right?';
        poll.execute(msg).indexOf('**Poll Started!**: *these tests are great right').should.not.eql(-1);
        msg.content = '!vote yeah';
        poll.vote(msg).should.eql('Thanks for voting JBuilds.');
        msg.content = '!poll x';
        const result = poll.execute(msg);
        result.indexOf('yeah').should.eql(-1);
        result.indexOf('yes: 1 (100%)').should.not.eql(-1);
        reply.should.be.false;
        // Negative case
        resetTest();
        msg.content = '!poll these tests are great right?';
        poll.execute(msg).indexOf('**Poll Started!**: *these tests are great right').should.not.eql(-1);
        msg.content = '!vote nope';
        poll.vote(msg).should.eql('Thanks for voting JBuilds.');
        msg.content = '!poll x';
        const result2 = poll.execute(msg);
        result2.indexOf('nope').should.eql(-1);
        result2.indexOf('no: 1 (100%)').should.not.eql(-1);
        reply.should.be.false;
    });
});
