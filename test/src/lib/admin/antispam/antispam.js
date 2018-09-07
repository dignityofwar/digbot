//  Copyright © 2018 DIG Development team. All rights reserved.

const should = require('chai').should();

const config = require('config');
const antispam = require('../../../../../src/lib/admin/antispam/antispam.js');

describe('admin/antispam/antispam.js', function() {
    it('should have function check', function() {
        antispam.should.have.property('check');
        antispam.check.should.be.a('function');
    });

    // Construct fake message
    let message = {
        author: '90161375896555555',
        channel: {
            id: '224190000554555555',
            sendMessage: function() {
                return new Promise(function(resolve) {
                    resolve();
                });
            }
        },
        content: '!cats',
        member: {
            displayName: 'Dingbat1'
        }
    };
    const original = config.get('features');
    let features = original;

    it('Antispam should not kick in if disabled', function() {
        features.disableCommandSpam = true;
        config.setProperty('features', features);
        // Antispam should never trigger here no matter how many commands sent
        for (let i = -3; i < config.get('antispamCommandLimitCats'); i++) {
            antispam.check(message).should.be.true;
        }
        config.setProperty('features', original);
    });

    it('Commands should trigger antispam', function() {
        features.disableCommandSpam = false;
        config.setProperty('features', features);
        // Test the !cats command the number of time it should be allowed
        for (let i = 0; i < config.get('antispamCommandLimitCats'); i++) {
            antispam.check(message).should.be.true;
        }
        // Next call should trigger the antispam module
        antispam.check(message).should.be.false;
        config.setProperty('features', original);
    });

    it('Users should trigger antispam', function() {
        features.disableCommandSpam = false;
        config.setProperty('features', features);
        // User should trigger antispam
        message = {
            author: '90161375896170000',
            channel: {
                id: '224190000554570000',
                sendMessage: function() {
                    return new Promise(function(resolve) {
                        resolve();
                    });
                }
            },
            content: '!ping',
            member: {
                displayName: 'Dingbat2'
            }
        };
        // Test the commands the number of time they should be allowed
        for (let i = 0; i < config.get('antispamUserLimit'); i++) {
            antispam.check(message).should.be.true;
        }
        // Next call should trigger the antispam module
        antispam.check(message, true).should.be.false;
        config.setProperty('features', original);
    });
});
