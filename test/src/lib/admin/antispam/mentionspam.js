//  Copyright © 2018 DIG Development team. All rights reserved.

const expect = require('chai').expect;
const should = require('chai').should();

const config = require('../../../../../config/config.js');
const mentionspam = require('../../../../../src/lib/admin/antispam/mentionspam.js');

describe('admin/antispam/mentionspam.js', function() {
    it('should have function edits', function() {
        mentionspam.should.have.property('edits');
        mentionspam.edits.should.be.a('function');
    });

    it('should have function execute', function() {
        mentionspam.should.have.property('execute');
        mentionspam.execute.should.be.a('function');
    });

    // Construct roles maps for the 3 scenarios for exempt members
    let wrongRoles = new Map();
    let role = '094325820950343';
    wrongRoles.set(role, {id: '23423465246246'});

    let staffRoles = new Map();
    role = config.getConfig().staffRoleID;
    staffRoles.set(role, {id: config.getConfig().staffRoleID});

    let gameLeaderRoles = new Map();
    role = config.getConfig().general.leaderRoles[0];
    gameLeaderRoles.set(role, {id: config.getConfig().general.leaderRoles[0]});

    // Construct message, first without the roles
    let message = {
        member: {
            roles: wrongRoles
        }
    };

    it('should have function exemptMember', function() {
        mentionspam.should.have.property('exemptMember');
    });

    it('Member with wrong roles should not be exempt', function() {
        mentionspam.exemptMember(message).should.be.false;
    });

    it('Member with staff role should be exempt', function() {
        // If member is exempt because they're a staff member
        message.member.roles = staffRoles;
        mentionspam.exemptMember(message).should.be.true;
    });

    it('Member with game leader role should be exempt', function() {
        // If member is exempt because they're a game leader
        message.member.roles = gameLeaderRoles;
        mentionspam.exemptMember(message).should.be.true;
    });

    it('should have function joinCheck', function() {
        mentionspam.should.have.property('joinCheck');
    });

    it('should have function memberUpdate', function() {
        mentionspam.should.have.property('memberUpdate');
    });

    it('should have function passList', function() {
        mentionspam.should.have.property('passList');
        expect(mentionspam.passList()).to.be.an('object');
    });

    it('should have function release', function() {
        mentionspam.should.have.property('release');
    });
});
