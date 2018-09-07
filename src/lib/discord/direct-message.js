//  Copyright © 2018 DIG Development team. All rights reserved.

'use strict';

// Handles DMs

const config = require('config');
const logger = require('../logger.js');
const server = require('../server/server.js');
const TAG = 'botDMs';

module.exports = {
    handle: function(msg) {
        logger.debug(TAG, `DM content: "${msg.content}"`);
        if (!msg.content.toLowerCase().startsWith('!staff') && !msg.content.toLowerCase().startsWith('!developers')) {
            msg.reply('Hey, thanks for contacting DIGBot. You should know I\'m just a bunch of ' +
                '1s and 0s so if you\'re looking for a chat I\'d look elsewhere. If however you\'re ' +
                'attempting to contact this bot\'s devs or the DIG community staff then you can do so by ' +
                'starting your message with \"!staff\" or \"!developers\"'
            )
                .then(function() {
                    logger.debug(TAG, 'Succesfully sent reply');
                })
                .catch(err => {
                    logger.warning(TAG, 'Failed to send reply, error: ' + err);
                });

            return true;
        }

        if (msg.content.toLowerCase().startsWith('!staff')) {
            if (msg.content.substring(7) === ' ' || msg.content.length === 6) {
                return this.handleEmptyMessage(msg);
            }

            msg.reply('Thanks, I\'ll pass your message onto the staff, please be sure you\'ve left a way for us to ' +
                'get back to you if you\'re not contacting us from the DIG server.')
                .then(function() {
                    logger.debug(TAG, 'Succesfully sent reply');
                })
                .catch(function(err) {
                    logger.warning(TAG, 'Failed to send reply, error: ' + err);
                });
            let relay = 'Message from: ' + msg.author.username;
            relay += '\nContent: ' + msg.content.substring(7);
            if (server.getChannel('staff') !== null && config.util.getEnv('NODE_ENV') !== 'testing') {
                server.getChannel('staff').sendMessage(relay)
                    .then(function() {
                        logger.debug(TAG, 'Succesfully sent message to staff');
                    })
                    .catch(err => {
                        logger.warning(TAG, 'Failed to send message to staff, error: ' + err);
                    });
            }

            return true;
        }

        if (msg.content.toLowerCase().startsWith('!developers')) {
            if (msg.content.substring(12) === ' ' || msg.content.length === 11) {
                return this.handleEmptyMessage(msg);
            }

            msg.reply('Thanks, I\'ll pass your message onto the devs, please be sure you\'ve left a way for us to ' +
                'get back to you if you\'re not contacting us from the DIG server.')
                .then(function() {
                    logger.debug(TAG, 'Succesfully sent reply');
                })
                .catch(err => {
                    logger.warning(TAG, 'Failed to send reply, error: ' + err);
                });
            let relay = 'Message from: ' + msg.author.username;
            relay += '\nContent: ' + msg.content.substring(12);

            if (server.getChannel('developers') !== null && config.util.getEnv('NODE_ENV') !== 'testing') {
                server.getChannel('developers').sendMessage(relay)
                    .then(function() {
                        logger.debug(TAG, 'Succesfully sent message to developers');
                    })
                    .catch(err => {
                        logger.warning(TAG, 'Failed to send message to developers, error: ' + err);
                    });
            }

            return true;
        }
    },
    handleEmptyMessage: function(msg) {
        msg.reply('Please make sure you type us a message, or we don\'t know what your request is regarding. ' +
            'Please try again.')
            .then(function() {
                logger.debug(TAG, 'Succesfully sent reply');
            })
            .catch(err => {
                logger.warning(TAG, 'Failed to send reply, error: ' + err);
            });
        return false;
    }
};
