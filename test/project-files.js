//  Copyright © 2018 DIG Development team. All rights reserved.

const should = require('chai').should();

const config = require('config');
const fs = require('fs');

describe('critical project files', function() {
    it('should have git attributes', function() {
        let success = false;
        try {
            fs.existsSync(config.get('general.root') + '/.gitattributes');
            success = true;
        } catch (err) {
            console.log(err);
        }
        success.should.be.true;
    });

    it('should have git ignore', function() {
        let success = false;
        try {
            fs.existsSync(config.get('general.root') + '/.gitignore');
            success = true;
        } catch (err) {
            console.log(err);
        }
        success.should.be.true;
    });

    it('should have user config', function() {
        let success = false;
        try {
            fs.existsSync(config.get('general.root') + '/config.user.js');
            success = true;
        } catch (err) {
            console.log(err);
        }
        success.should.be.true;
    });

    it('should have production docker composition', function() {
        let success = false;
        try {
            fs.existsSync(config.get('general.root') + '/docker-compose-prod.yml');
            success = true;
        } catch (err) {
            console.log(err);
        }
        success.should.be.true;
    });

    it('should have test docker composition', function() {
        let success = false;
        try {
            fs.existsSync(config.get('general.root') + '/docker-compose-test.yml');
            success = true;
        } catch (err) {
            console.log(err);
        }
        success.should.be.true;
    });

    it('should have standard docker composition', function() {
        let success = false;
        try {
            fs.existsSync(config.get('general.root') + '/docker-compose.yml');
            success = true;
        } catch (err) {
            console.log(err);
        }
        success.should.be.true;
    });

    it('should have standard docker file', function() {
        let success = false;
        try {
            fs.existsSync(config.get('general.root') + '/Dockerfile.yml');
            success = true;
        } catch (err) {
            console.log(err);
        }
        success.should.be.true;
    });

    it('should have project readme', function() {
        let success = false;
        try {
            fs.existsSync(config.get('general.root') + '/README.md');
            success = true;
        } catch (err) {
            console.log(err);
        }
        success.should.be.true;
    });
});
