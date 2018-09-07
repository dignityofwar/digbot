//  Copyright © 2018 DIG Development team. All rights reserved.

const should = require('chai').should();

const config = require('config');
const server = require('../../../../src/lib/server/server.js');

describe('server/server.js', function() {
    it('should have the function "getReady"', function() {
        server.should.have.property('getReady');
        server.getReady.should.be.a('function');
    });

    describe('test ready and booted getters/setters', function() {
        before(function(done) {
            setTimeout(done, 50); // More than enough time for bot to have finished boot
        });

        it('should show bot as booted', function() {
            server.getBooted().should.be.true;
        });

        it('should show bot as ready', function() {
            const original = server.getReady();
            server.markAsReady();
            server.getReady().should.be.true;
            if (original === false) { server.markAsNotReady(); }
        });

        it('should show bot as not ready', function() {
            const original = server.getReady();
            server.markAsNotReady();
            server.getReady().should.be.false;
            if (original === true) { server.markAsReady(); }
        });
    });

    it('should have the function "getBooted"', function() {
        server.should.have.property('getBooted');
        server.getBooted.should.be.a('function');
    });

    it('should have the function "markAsReady"', function() {
        server.should.have.property('markAsReady');
        server.markAsReady.should.be.a('function');
    });

    it('should have the function "markAsNotReady"', function() {
        server.should.have.property('markAsNotReady');
        server.markAsNotReady.should.be.a('function');
    });

    it('should have the function "markBooted"', function() {
        server.should.have.property('markBooted');
        server.markBooted.should.be.a('function');
    });

    it('should have the function "getGuild"', function() {
        server.should.have.property('getGuild');
        server.getGuild.should.be.a('function');
    });

    it('should have the function "getAllGuilds"', function() {
        server.should.have.property('getAllGuilds');
        server.getAllGuilds.should.be.a('function');
    });

    it('should have the function "saveGuild"', function() {
        server.should.have.property('saveGuild');
        server.saveGuild.should.be.a('function');
    });

    it('should have the function "wipeGuild"', function() {
        server.should.have.property('wipeGuild');
        server.wipeGuild.should.be.a('function');
    });

    it('should have the function "wipeAllGuilds"', function() {
        server.should.have.property('wipeAllGuilds');
        server.wipeAllGuilds.should.be.a('function');
    });

    it('should have the function "getChannel"', function() {
        server.should.have.property('getChannel');
        server.getChannel.should.be.a('function');
    });

    it('should have the function "getChannelInGuild"', function() {
        server.should.have.property('getChannelInGuild');
        server.getChannelInGuild.should.be.a('function');
    });

    it('should have the function "setChannel"', function() {
        server.should.have.property('setChannel');
        server.setChannel.should.be.a('function');
    });

    it('should have the function "wipeChannel"', function() {
        server.should.have.property('wipeChannel');
        server.wipeChannel.should.be.a('function');
    });

    it('should have the function "wipeChannels"', function() {
        server.should.have.property('wipeChannels');
        server.wipeChannels.should.be.a('function');
    });

    it('should have the function "saveUser"', function() {
        server.should.have.property('saveUser');
        server.saveUser.should.be.a('function');
    });

    describe('test non manipulated server data', function() {
        before(function(done) {
            setTimeout(done, 50); // More than enough time for bot to have finished boot
        });

        it('should fetch default guild if no ID specified', function() {
            server.getGuild().id.should.eql(config.get('general.server'));
        });

        it('guild object should have correct properties', function() {
            const guild = server.getGuild();
            guild.id.should.be.a('string');
            guild.createdTimestamp.should.be.a('number');
            guild.name.should.be.a('string');
        });

        it('guilds object should have all guilds in it', function() {
            const guilds = server.getAllGuilds();
            guilds.should.be.a('object');
            for (let x in guilds) {
                guilds[x].id.should.be.a('string');
                guilds[x].createdTimestamp.should.be.a('number');
                guilds[x].name.should.be.a('string');
            }
        });

        it('should store time connected since', function() {
            const connected = server.getConnectedSince().getTime();
            connected.should.be.a('number');
            // I'd expect 50-70ms ish, but no need to be concerened unless value is negative or really big
            Math.sign(Date.now() - connected).should.eql(1);
            ((Date.now() - connected) < 300000).should.be.true;
        });

        it('should store members on server', function() {
            server.getMembersOnServer().should.be.a('number');
        });

        it('should store members playing on server', function() {
            server.getMembersPlaying().should.be.a('number');
        });
    });
});
