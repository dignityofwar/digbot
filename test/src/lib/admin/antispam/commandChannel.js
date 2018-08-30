//  Copyright © 2018 DIG Development team. All rights reserved.

const should = require('chai').should();

const commandChannel = require('../../../../../src/lib/admin/antispam/commandChannel.js');

/* James:
Tests are very minimal here for now don't really see a point in writing them until #331 as I'm not
sure without looking into it whether this is a matter of changing a value or reworking the
entire module
*/

describe('admin/antispam/mentionspam.js', function() {
    it('should have function execute', function() {
        commandChannel.should.have.property('execute');
        commandChannel.execute.should.be.a('function');
    });

    it('should have function ready', function() {
        commandChannel.should.have.property('ready');
        commandChannel.ready.should.be.a('function');
    });
});
