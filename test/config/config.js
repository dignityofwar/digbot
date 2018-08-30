//  Copyright © 2018 DIG Development team. All rights reserved.

const expect = require('chai').should();

const config = require('../../config/config.js');

describe('config.js', function() {
    const original = config.getConfig();

    it('should have function getConfig', function() {
        config.should.have.property('getConfig');
        config.getConfig.should.be.a('function');
    });

    it('getConfig should return a config object', function() {
        config.getConfig().should.be.an('object');
    });

    it('should have function setConfig', function() {
        config.should.have.property('setConfig');
        config.setConfig.should.be.a('function');
    });

    it('setConfig should require input', function() {
        config.setConfig().should.be.false;
    });

    it('setConfig should set the config to whatever arguement is provided', function() {
        config.setConfig(6).should.be.true;
        config.getConfig().should.eql(6);
        config.setConfig(original);
    });

    it('should have function setProperty', function() {
        config.should.have.property('setConfig');
        config.setProperty.should.be.a('function');
    });

    it('setProperty should require property arugement', function() {
        config.setProperty().should.be.false;
    });

    it('setProperty should require value arguement', function() {
        config.setProperty('token').should.be.false;
    });

    it('setProperty should set properties to whatever arguement is provided', function() {
        config.setProperty('token', 'test value').should.be.true;
        config.getConfig().token.should.eql('test value');
        config.setConfig(original);
    });

    describe('should have critical properties', function() {
        it('should have bot token', function() {
            config.getConfig().token.should.be.a('string');
        });

        it('should have root directory configured', function() {
            config.getConfig().general.root.should.be.a('string');
        });

        it('should have server ID', function() {
            config.getConfig().general.server.should.be.a('string');
        });

        it('should have port set', function() {
            config.getConfig().general.port.should.be.a('number');
        });

        it('should have bot user ID', function() {
            config.getConfig().botUserID.should.be.a('string');
        });
    });
});
