//  Copyright © 2018 DIG Development team. All rights reserved.

const should = require('chai').should();

const botEvents = require('../../../../src/lib/discord/bot-events.js');
const config = require('config');
const server = require('../../../../src/lib/server/server.js');

describe('discord/bot-events.js', function() {
    it('should have function channelCreate', function() {
        botEvents.should.have.property('channelCreate');
        botEvents.channelCreate.should.be.a('function');
    });

    describe('channelCreate failure cases', function() {
        let channel = {};

        beforeEach(function() {
            channel = {};
        });

        it('should ignore dm channel creations', function() {
            channel.type = 'dm';
            botEvents.channelCreate(channel, true).should.be.false;
        });

        it('should ignore group channel creations', function() {
            channel.type = 'group';
            botEvents.channelCreate(channel, true).should.be.false;
        });

        it('should ignore creation of channels not belonging to guilds', function() {
            channel.guild = false;
            botEvents.channelCreate(channel, true).should.be.false;
        });

        it('should ignore creation of channels not belonging to relevent guild', function() {
            channel.guild = {id: '000000000000044224'};
            botEvents.channelCreate(channel, true).should.be.false;
        });

        it('should ignore creation of channels if bot not ready', function() {
            channel.guild = {id: config.get('general.server')};
            const original = server.getReady();
            server.markAsNotReady();
            botEvents.channelCreate(channel, true).should.be.false;
            if (original === true) { server.markAsReady(); }
        });
    });

    it('should have function channelDelete', function() {
        botEvents.should.have.property('channelDelete');
        botEvents.channelDelete.should.be.a('function');
    });

    describe('channelDelete failure cases', function() {
        let channel = {};

        beforeEach(function() {
            channel = {};
        });

        it('should ignore dm channel deletions', function() {
            channel.type = 'dm';
            botEvents.channelDelete(channel, true).should.be.false;
        });

        it('should ignore group channel deletions', function() {
            channel.type = 'group';
            botEvents.channelDelete(channel, true).should.be.false;
        });

        it('should ignore deletion of channels not belonging to guilds', function() {
            channel.guild = false;
            botEvents.channelDelete(channel, true).should.be.false;
        });

        it('should ignore deletion of channels not belonging to relevent guild', function() {
            channel.guild = {id: '000000000000044224'};
            botEvents.channelDelete(channel, true).should.be.false;
        });

        it('should ignore deletion of channels if bot not ready', function() {
            channel.guild = {id: config.get('general.server')};
            const original = server.getReady();
            server.markAsNotReady();
            botEvents.channelDelete(channel, true).should.be.false;
            if (original === true) { server.markAsReady(); }
        });
    });

    it('should have function channelUpdate', function() {
        botEvents.should.have.property('channelUpdate');
        botEvents.channelUpdate.should.be.a('function');
    });

    describe('channelUpdate failure cases', function() {
        let channel = {};

        beforeEach(function() {
            channel = {};
        });

        it('should ignore dm channel updates', function() {
            channel.type = 'dm';
            botEvents.channelUpdate(channel, channel, true).should.be.false;
        });

        it('should ignore group channel updates', function() {
            channel.type = 'group';
            botEvents.channelUpdate(channel, channel, true).should.be.false;
        });

        it('should ignore updates of channels not belonging to guilds', function() {
            channel.guild = false;
            botEvents.channelUpdate(channel, channel, true).should.be.false;
        });

        it('should ignore updates of channels not belonging to relevent guild', function() {
            channel.guild = {id: '000000000000044224'};
            botEvents.channelUpdate(channel, channel, true).should.be.false;
        });

        it('should ignore updates of channels if bot not ready', function() {
            channel.guild = {id: config.get('general.server')};
            const original = server.getReady();
            server.markAsNotReady();
            botEvents.channelUpdate(channel, channel, true).should.be.false;
            if (original === true) { server.markAsReady(); }
        });
    });

    it('should have function debug', function() {
        botEvents.should.have.property('debug');
        botEvents.debug.should.be.a('function');
    });

    it('should have function disconnectEvent', function() {
        botEvents.should.have.property('disconnectEvent');
        botEvents.disconnectEvent.should.be.a('function');
    });

    it('should have function guildCreate', function() {
        botEvents.should.have.property('guildCreate');
        botEvents.guildCreate.should.be.a('function');
    });

    it('should have function guildDelete', function() {
        botEvents.should.have.property('guildDelete');
        botEvents.guildDelete.should.be.a('function');
    });

    it('should have function guildMemberAdd', function() {
        botEvents.should.have.property('guildMemberAdd');
        botEvents.guildMemberAdd.should.be.a('function');
    });

    describe('guildMemberAdd failure cases', function() {
        let member = {guild: {}};

        beforeEach(function() {
            member = {guild: {}};
        });

        it('should ignore new members not from relevant guild', function() {
            member.guild.id = '003500500000';
            botEvents.guildMemberAdd(member, true).should.be.false;
        });

        it('should ignore new members if bot not ready', function() {
            member.guild.id = config.get('general.server');
            const original = server.getReady();
            server.markAsNotReady();
            botEvents.guildMemberAdd(member, true).should.be.false;
            if (original === true) { server.markAsReady(); }
        });
    });

    it('should have function guildMemberRemove', function() {
        botEvents.should.have.property('guildMemberRemove');
        botEvents.guildMemberRemove.should.be.a('function');
    });

    describe('guildMemberRemove failure cases', function() {
        let member = {guild: {}};

        beforeEach(function() {
            member = {guild: {}};
        });

        it('should ignore leaving members not from relevant guild', function() {
            member.guild.id = '003500500000';
            botEvents.guildMemberRemove(member, true).should.be.false;
        });

        it('should ignore leaving members if bot not ready', function() {
            member.guild.id = config.get('general.server');
            const original = server.getReady();
            server.markAsNotReady();
            botEvents.guildMemberRemove(member, true).should.be.false;
            if (original === true) { server.markAsReady(); }
        });
    });

    it('should have function guildMemberUpdate', function() {
        botEvents.should.have.property('guildMemberUpdate');
        botEvents.guildMemberUpdate.should.be.a('function');
    });

    describe('guildMemberUpdate failure cases', function() {
        let member = {guild: {}};

        beforeEach(function() {
            member = {guild: {}};
        });

        it('should ignore updated members not from relevant guild', function() {
            member.guild.id = '003500500000';
            botEvents.guildMemberUpdate(member, member).should.be.false;
        });

        it('should ignore updated members if bot not ready', function() {
            member.guild.id = config.get('general.server');
            const original = server.getReady();
            server.markAsNotReady();
            botEvents.guildMemberUpdate(member, member).should.be.false;
            if (original === true) { server.markAsReady(); }
        });
    });

    it('should have function guildUpdate', function() {
        botEvents.should.have.property('guildUpdate');
        botEvents.guildUpdate.should.be.a('function');
    });

    describe('guildUpdate failure cases', function() {
        let guild = {};

        beforeEach(function() {
            guild = {};
        });

        it('should ignore updated members not from relevant guild', function() {
            guild.id = '003500500000';
            botEvents.guildUpdate(guild, guild, true).should.be.false;
        });

        it('should ignore updated members if bot not ready', function() {
            guild.id = config.get('general.server');
            const original = server.getReady();
            server.markAsNotReady();
            botEvents.guildUpdate(guild, guild, true).should.be.false;
            if (original === true) { server.markAsReady(); }
        });
    });

    it('should have function message', function() {
        botEvents.should.have.property('message');
        botEvents.message.should.be.a('function');
    });

    describe('message failure cases', function() {
        let msg = {};

        beforeEach(function() {
            msg = {
                author: {},
                channel: {},
                member: {
                    displayName: 'JBuilds',
                    id: '0560606060',
                    roles: {
                        has: function() {
                            return true;
                        }
                    }
                },
                guild: {}
            };
        });

        it('should ignore messages from bots', function() {
            msg.author.bot = true;
            botEvents.message(msg).should.be.false;
        });

        it('should ignore messages not from relevant server', function() {
            msg.author.bot = false;
            msg.channel.type = 'text';
            msg.guild.id = '00000000066666';
            botEvents.message(msg).should.be.false;
        });

        it('should ignore messages that do not have command prefix', function() {
            msg.author.bot = false;
            msg.channel.type = 'text';
            msg.guild.id = config.get('general.server');
            msg.content = 'Long live ATRA!';
            botEvents.message(msg).should.be.false;
        });

        it('should ignore messages that are not commands', function() {
            msg.author.bot = false;
            msg.channel.type = 'text';
            msg.guild.id = config.get('general.server');
            msg.content = '!!! What in monetization?!';
            botEvents.message(msg).should.be.false;
        });

        it('should ignore messages if bot not ready', function() {
            msg.author.bot = false;
            msg.channel.type = 'text';
            msg.guild.id = config.get('general.server');
            msg.content = '!!! What in monetization?!';
            const original = server.getReady();
            server.markAsNotReady();
            botEvents.message(msg).should.be.false;
            if (original === true) { server.markAsReady(); }
        });
    });

    it('should have function messageUpdate', function() {
        botEvents.should.have.property('messageUpdate');
        botEvents.messageUpdate.should.be.a('function');
    });

    describe('messageUpdate failure cases', function() {
        let msg = {};

        beforeEach(function() {
            msg = {
                channel: {
                    type: 'text'
                },
                guild: {}
            };
        });

        it('should ignore DM updates', function() {
            msg.channel.type = 'dm';
            msg.guild.id = config.get('general.server');
            botEvents.messageUpdate(msg, msg).should.be.false;
        });

        it('should ignore group message updates', function() {
            msg.channel.type = 'group';
            msg.guild.id = config.get('general.server');
            botEvents.messageUpdate(msg, msg).should.be.false;
        });

        it('should ignore messages not from relevant guild', function() {
            msg.guild.id = '003500500000';
            botEvents.messageUpdate(msg, msg).should.be.false;
        });

        it('should ignore messages if bot not ready', function() {
            msg.guild.id = config.get('general.server');
            const original = server.getReady();
            server.markAsNotReady();
            botEvents.messageUpdate(msg, msg).should.be.false;
            if (original === true) { server.markAsReady(); }
        });
    });

    it('should have function presenceUpdate', function() {
        botEvents.should.have.property('presenceUpdate');
        botEvents.presenceUpdate.should.be.a('function');
    });

    describe('presenceUpdate failure cases', function() {
        let member = {};

        beforeEach(function() {
            member = {
                guild: {}
            };
        });

        it('should ignore messages not from relevant guild', function() {
            member.guild.id = '003500500000';
            botEvents.presenceUpdate(member, member).should.be.false;
        });

        it('should ignore messages if bot not ready', function() {
            member.guild.id = config.get('general.server');
            const original = server.getReady();
            server.markAsNotReady();
            botEvents.presenceUpdate(member, member).should.be.false;
            if (original === true) { server.markAsReady(); }
        });
    });

    it('should have function ready', function() {
        botEvents.should.have.property('ready');
        botEvents.ready.should.be.a('function');
    });

    it('should have function reconnecting', function() {
        botEvents.should.have.property('reconnecting');
        botEvents.reconnecting.should.be.a('function');
    });

    it('should have function roleCreate', function() {
        botEvents.should.have.property('roleCreate');
        botEvents.roleCreate.should.be.a('function');
    });

    describe('roleCreate failure cases', function() {
        let role = {};

        beforeEach(function() {
            role = {
                guild: {}
            };
        });

        it('should ignore role creations not from relevant guild', function() {
            role.guild.id = '003500500000';
            botEvents.roleCreate(role, true).should.be.false;
        });

        it('should ignore role creations if bot not ready', function() {
            role.guild.id = config.get('general.server');
            const original = server.getReady();
            server.markAsNotReady();
            botEvents.roleCreate(role, true).should.be.false;
            if (original === true) { server.markAsReady(); }
        });
    });

    it('should have function roleDelete', function() {
        botEvents.should.have.property('roleDelete');
        botEvents.roleDelete.should.be.a('function');
    });

    describe('roleDelete failure cases', function() {
        let role = {};

        beforeEach(function() {
            role = {
                guild: {}
            };
        });

        it('should ignore role deletions not from relevant guild', function() {
            role.guild.id = '003500500000';
            botEvents.roleDelete(role, true).should.be.false;
        });

        it('should ignore role deletions if bot not ready', function() {
            role.guild.id = config.get('general.server');
            const original = server.getReady();
            server.markAsNotReady();
            botEvents.roleDelete(role, true).should.be.false;
            if (original === true) { server.markAsReady(); }
        });
    });

    it('should have function roleUpdate', function() {
        botEvents.should.have.property('roleUpdate');
        botEvents.roleUpdate.should.be.a('function');
    });

    describe('roleUpdate failure cases', function() {
        let role = {};

        beforeEach(function() {
            role = {
                guild: {}
            };
        });

        it('should ignore role updates not from relevant guild', function() {
            role.guild.id = '003500500000';
            botEvents.roleDelete(role, role, true).should.be.false;
        });

        it('should ignore role updates if bot not ready', function() {
            role.guild.id = config.get('general.server');
            const original = server.getReady();
            server.markAsNotReady();
            botEvents.roleDelete(role, role, true).should.be.false;
            if (original === true) { server.markAsReady(); }
        });
    });

    it('should have function voiceStateUpdate', function() {
        botEvents.should.have.property('voiceStateUpdate');
        botEvents.voiceStateUpdate.should.be.a('function');
    });

    describe('voiceStateUpdate failure cases', function() {
        let member = {};

        beforeEach(function() {
            member = {
                guild: {}
            };
        });

        it('should ignore voice state updates not from relevant guild', function() {
            member.guild.id = '003500500000';
            botEvents.voiceStateUpdate(member, member, true).should.be.false;
        });

        it('should ignore voice state updates if bot not ready', function() {
            member.guild.id = config.get('general.server');
            const original = server.getReady();
            server.markAsNotReady();
            botEvents.voiceStateUpdate(member, member, true).should.be.false;
            if (original === true) { server.markAsReady(); }
        });
    });

    it('should have function warning', function() {
        botEvents.should.have.property('warning');
        botEvents.warning.should.be.a('function');
    });

    // Just test one live event scenario for purpose of roughly checking module flow
    describe('test ping command', function() {
        const now = new Date();
        const msg = {
            author: {
                bot: false
            },
            channel: {
                sendMessage: function(relay) {
                    channelMessage = relay;
                    return new Promise(function(resolve) {
                        resolve(message);
                    });
                },
                id: config.get('channels.mappings.digbot'),
                type: 'text'
            },
            content: '!ping',
            createdTimestamp: now.getTime(),
            guild: {
                id: config.get('general.server')
            },
            member: {
                displayName: 'JBuilds',
                id: '0505054930946',
                roles: {
                    has: function() {
                        return true;
                    }
                }
            }
        };
        let message = {
            createdTimestamp: now.getTime() + 10,
            edit: function(relay) {
                result = relay;
                return new Promise(function(resolve) {
                    resolve(true);
                });
            }
        };
        let channelMessage = false;
        let result = false;

        before(function(done) {
            message.createdTimestamp = now.getTime() + 10;
            botEvents.message(msg);
            let complete = setTimeout(done, 5); // Give promises time to execute
        });

        it('test results should be in', function() {
            channelMessage.should.eql('pong');
            result.should.not.be.false;
        });

        it('should show excellent ping', function() {
            result.should.eql('Ping: 10ms (Excellent)');
        });
    });
});
