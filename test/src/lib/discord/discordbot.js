//  Copyright © 2018 DIG Development team. All rights reserved.

const should = require('chai').should();

const discordbot = require('../../../../src/lib/discord/discordbot.js');

describe('discord/direct-message.js', function() {
    it('should have the function "init"', function() {
        discordbot.should.have.property('init');
        discordbot.init.should.be.a('function');
    });

    it('should have the function "injectMessage"', function() {
        discordbot.should.have.property('injectMessage');
        discordbot.injectMessage.should.be.a('function');
    });
});
