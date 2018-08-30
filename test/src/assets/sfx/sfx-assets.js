//  Copyright © 2018 DIG Development team. All rights reserved.

const should = require('chai').should();

const assets = require('../../../../src/assets/sfx/sfx-assets.js');

describe('assets/sfx/sfx-assets.js', function() {
    it('module should export sfx assets object', function() {
        assets.should.be.a('object');
    });

    it('sfx properties should be of sfx assets', function() {
        assets.should.have.property('admin');
        assets.should.have.property('brutal');
        assets.should.have.property('farm');
        assets.should.have.property('shame');
    });

    it('sfx should contain bare minimum of 5 sfx', function() {
        (Object.keys(assets).length > 5).should.be.true;
    });

    it('sfx assets should come with a source, link, options and a description', function() {
        for (let x in assets) {
            assets[x].source.should.be.a('string');
            assets[x].link.should.be.a('string');
            assets[x].link.indexOf('https://www.youtube.com/watch?v=').should.eql(0);
            assets[x].options.should.be.a('object');
            assets[x].options.volume.should.be.a('number');
            assets[x].description.should.be.a('string');
        }
    });
});
