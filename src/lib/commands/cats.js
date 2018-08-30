//  Copyright © 2018 DIG Development team. All rights reserved.

'use strict';

// Module for !cats command

const logger = require('../logger.js');
const request = require('request');
const root = 'http://thecatapi.com/api/images/get';
const TAG = '!cats';

module.exports = {
    // Grabs a random cat gif from TheCatAPI, returns link
    gif: function() {
        return new Promise(function(resolve) {
            let r = request
                .get(root + '?format=src&type=gif', function() {
                    logger.debug(TAG, 'API response: ' + r.uri.href);
                    let cat = r.uri.href;
                    if (cat.endsWith('gif')) {
                        resolve(cat);
                    } else {
                        logger.warning(TAG, 'Triggered img function, did not grab gif');
                        resolve('http://i.imgur.com/fxorJTQ.jpg');
                    }
                })
                .on('response', function(response) {
                    logger.debug(TAG, response.statusCode); // 200
                    logger.debug(TAG, response.headers['content-type']); // 'image/gif'
                    if (response.statusCode !== 200) {resolve('http://i.imgur.com/fxorJTQ.jpg');}
                });
        });
    },

    // Grabs a random cat image from TheCatAPI, returns link
    img: function() {
        return new Promise(function(resolve) {
            let r = request
                .get(root + '?format=src&type=jpg', function() {
                    logger.debug(TAG, 'API response: ' + r.uri.href);
                    let cat = r.uri.href;
                    if (cat.endsWith('jpg')) {
                        resolve(cat);
                    } else {
                        logger.warning(TAG, 'Triggered img function, did not grab jpg');
                        resolve('http://i.imgur.com/fxorJTQ.jpg');
                    }
                })
                .on('response', function(response) {
                    logger.debug(TAG, response.statusCode); // 200
                    logger.debug(TAG, response.headers['content-type']); // 'image/png'
                    if (response.statusCode !== 200) {resolve('http://i.imgur.com/fxorJTQ.jpg');}
                });
        });
    }
};
