//  Copyright © 2018 DIG Development team. All rights reserved.

const should = require('chai').should();

const config = require('config');
const detectplaying = require('../../../../../src/lib/admin/roles/detectplaying.js');

describe('admin/roles/detectplaying.js', function() {
    it('should have function check', function() {
        detectplaying.should.have.property('check');
        detectplaying.check.should.be.a('function');
    });

    it('should return false even if no arguements if feature disabled', function() {
        const original = config.get('features');
        let features = original;
        features.automaticRoleAssignment = false;
        config.setProperty('features', features);
        let success = false;
        try {
            detectplaying.check();
            success = true;
        } catch (err) {
            console.log(err);
        }
        config.setProperty('features', original);
        success.should.be.true;
    });

    /* Issue #351 James: tests can probably be expanded upon here to test the module in action so this
    can't happen again. Will take server.js manipulation plus building test objects with maps so I'll
    issue it */
});
