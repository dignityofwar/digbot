//  Copyright © 2018 DIG Development team. All rights reserved.

const should = require('chai').should();

const assets = require('../../../../src/assets/music/play-assets.js');

describe('assets/music/play-assets.js', function() {
    it('should have object "pass"', function() {
        assets.should.have.property('pass');
        assets.pass.should.be.a('object');
    });

    const pass = assets.pass;

    it('pass properties should contain playlists', function() {
        pass.should.have.property('fun');
        pass.should.have.property('nightcore');
        pass.should.have.property('90\'s');
        pass.should.have.property('00\'s');
        pass.should.have.property('10\'s');
    });

    it('pass properties should be objects with a description and playlist object', function() {
        for (let x in pass) {
            pass[x].should.have.property('description');
            pass[x].description.should.be.a('string');
            pass[x].should.have.property('playlist');
            pass[x].playlist.should.be.a('object');
        }
    });

    it('hardcoded playlists should have a length of bare minimum 30', function() {
        let success = false;
        for (let x in pass) {
            success = false;
            if (Object.keys(pass[x].playlist).length > 30) {
                success = true;
            } else {
                console.log(x + ' playlist length: ' + Object.keys(pass[x].playlist).length);
            }
            success.should.be.true;
        }
    });

    it('every playlist entry should have a youtube link, a name, and a volume', function() {
        for (let x in pass) {
            for (let y in pass[x].playlist) {
                pass[x].playlist[y].name.should.be.a('string');
                pass[x].playlist[y].link.should.be.a('string');
                pass[x].playlist[y].link.indexOf('https://www.youtube.com/watch?v=').should.eql(0);
                pass[x].playlist[y].volume.should.be.a('number');
                (pass[x].playlist[y].volume > 0).should.be.true;
                (pass[x].playlist[y].volume < 10).should.be.true;
            }
        }
    });
});
