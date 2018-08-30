//  Copyright © 2018 DIG Development team. All rights reserved.

const should = require('chai').should();

const config = require('../../../../config/config.js');
const fs = require('fs');

describe('assets/pictures', function() {
    it('should have welcome banner', function() {
        let success = false;
        try {
            fs.existsSync(config.getConfig().general.root + '/src/assets/pictures/welcome-banner.png');
            success = true;
        } catch (err) {
            console.log(err);
        }
        success.should.be.true;
    });
});
