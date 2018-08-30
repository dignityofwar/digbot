//  Copyright © 2018 DIG Development team. All rights reserved.

const should = require('chai').should();

const config = require('../../../../../config/config.js');
const forcedPTTCheck = require('../../../../../src/lib/admin/roles/forcedpttcheck.js');

describe('admin/roles/forcedpttcheck.js', function() {
    it('should have function execute', function() {
        forcedPTTCheck.should.have.property('execute');
    });

    // Build fake oldMember and newMember objects
    let oldMember = {
        roles: new Map()
    };
    let newMember = {
        roles: new Map(),
        sendMessage: function(message) {
            return new Promise(function(resolve) {
                success = true;
                resolve(message);
            });
        }
    };
    let success = false;
    let role = '0943258200000';

    it('forcedPTTCheck should not detect added role', function() {
        oldMember.roles.set(role, {id: '2342346500000'});
        newMember.roles.set(role, {id: '2342346500000'});
        // Both old and new members don't have PTT role
        forcedPTTCheck.execute(oldMember, newMember).should.be.false;
        success.should.be.false;
    });

    it('forcedPTTCheck should not detect removed role', function() {
        // Old has PTT role but new doesn't, shouldn't send message
        role = config.getConfig().forcedPTTRoleID;
        oldMember.roles.set(role, {id: config.getConfig().forcedPTTRoleID});
        success = false;
        forcedPTTCheck.execute(oldMember, newMember).should.be.false;
        success.should.be.false;
    });

    it('forcedPTTCheck should not detect change in role', function() {
        // Both old and new members have PTT role, shouldn't send message
        newMember.roles.set(role, {id: config.getConfig().forcedPTTRoleID});
        success = false;
        forcedPTTCheck.execute(oldMember, newMember).should.be.false;
        success.should.be.false;
    });

    it('forcedPTTCheck should detect added role', function() {
        // New member has PTT role but old doesn't, message should send
        role = '2342346500000';
        oldMember.roles = {};
        oldMember.roles = new Map();
        oldMember.roles.set(role, {id: '2342346500000'});
        success = false;
        forcedPTTCheck.execute(oldMember, newMember).should.be.true;
        success.should.be.true; // Message sent
    });
});
