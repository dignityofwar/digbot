//  Copyright © 2018 DIG Development team. All rights reserved.

'use strict';

const assert = require('chai').assert;
const expect = require('chai').expect;
const should = require('chai').should();
const sinon = require('sinon');
var sinonStubPromise = require('sinon-stub-promise');
sinonStubPromise(sinon);

const bot = require('../../src/lib/discord/discordbot.js');
const commands = require('../../src/lib/commands/commands.js');
const config = require('config');
const logger = require('../../src/lib/logger.js');
const server = require('../../src/lib/server/server.js');

// Full integration test cases with stubs for discord.js
describe('bot-live-tests', function() {
    this.slow(5000);
    // Set test mode (should only be used when necessary for things like stopping messages going live)
    config.setProperty('testing', true);
    logger.setTesting();

    // Ensure the bot is connected and running prior to any tests
    console.log('starting bot');
    bot.init(() => { console.log('Bot is ready'); run(); });

    // Stub commands.sendMessage
    describe('Commands parsing tests', function() {

        beforeEach(function() {
            sinon.stub(commands, 'sendMessage').returns(void 0);

            let channel = server.getChannel('developers');
            sinon.stub(channel, 'sendMessage').returnsPromise();
        });

        afterEach(function() {
            commands.sendMessage.restore();

            let channel = server.getChannel('developers');
            channel.sendMessage.restore();
        });

        // test cases
        describe('!help', function() {
            it('should reply `!help`', function() {
                let message = createSimpleMessage('!help');
                bot.injectMessage(message);

                // Catch the channel output
                commands.sendMessage.getCall(0).args[0].should.have.string('!help');
            });

            it('should send a PM for `!help full`', function() {
                let message = createSimpleMessage('!help full');

                // Add author stub
                sinon.stub(message.author, 'sendMessage').returns(void 0);

                bot.injectMessage(message);

                // Catch the PM
                message.author.sendMessage.getCall(0).args[0].should.have.string('!help');
                message.author.sendMessage.restore();
            });
        });

        describe('!ping', function() {
            it('should parse `!ping` (resolves)', function() {
                let message = createSimpleMessage('!ping');

                bot.injectMessage(message);
                message.channel.sendMessage.resolves(message);

                // Catch the channel output
                console.log(message.channel.sendMessage.getCall(0).args[0]);
                message.channel.sendMessage.getCall(0).args[0].should.have.string('pong');

                message.edit.getCall(0).args[0].should.have.string('Ping: 0ms');
            });

            it('should parse `!ping` (rejects)', function() {
                let message = createSimpleMessage('!ping');

                bot.injectMessage(message);
                message.channel.sendMessage.rejects('no connection');
            });
        });
    });
});

function createSimpleMessage(message) {
    let msg = {};
    console.log('Guild ' + config.get('general.server'));
    server.getGuild(config.get('general.server'));

    msg.guild = server.getGuild(config.get('general.server'));
    msg.channel = server.getChannel('developers');
    msg.content = message;
    msg.member = msg.guild.members.array()[0];
    msg.author = msg.member.user || null;
    msg.reply = () => { };
    msg.edit = () => { };
    msg.createdTimestamp = 0;
    msg.mentions = {users: {array: () => []}, roles: {array: () => []}};

    // Add reply and edit stub
    sinon.stub(msg, 'reply').returns(void 0);
    sinon.stub(msg, 'edit').returnsPromise();

    return msg;
}
