//  Copyright © 2018 DIG Development team. All rights reserved.

'use strict';

// Check new members/updated members names and let them know if their name is not acceptable

const crashHandler = require('../crash-handling.js');
const logger = require('../logger.js');
const TAG = 'namecheck';

module.exports = {
    // Recieves guild member, check nickname if they have one else username
    execute: function(mem) {
        crashHandler.logEvent(TAG, 'execute');
        let name = mem.displayName;
        // Check if the first character of a members name is an "@" if so change their nickname for them
        if (/[@]/.test(name.substring(0, 1))) {
            let reg = /[^@]/.exec(name);
            if (reg != null && reg.index < name.length) {
                name = name.substring(reg.index);
            } else {
                name = 'Kevin';
            }
            logger.info(TAG, mem.displayName + ' was renamed to ' + name);
            mem.setNickname(name)
                .then(
                    logger.debug(TAG, 'Succesfully set nickname')
                )
                .catch(err => {
                    logger.warning(TAG, 'Failed attempt to change nickname of \"' +
                    mem.displayName + '\" to \"' + name + '\", ' + err);
                });
            mem.sendMessage(madLad)
                .then(() => {
                    logger.debug(TAG, 'Successfully sent message to member');
                })
                .catch(err => {
                    logger.warning(TAG, 'Failed to send message, error: ' + err);
                });
            return false;
        // Check if first 3 characters are silly
        } else if (/[^\w!'"£%^&()-=+_<>?\[\]{}$#~@`]/.test(name.substring(0, 3))) {
            logger.info(TAG, mem.displayName + ' was emplored to change their name');
            // Emplore but do not force more sensible name
            mem.sendMessage(emplore)
                .then(() => {
                    logger.debug(TAG, 'Successfully sent message part 1 to member');
                })
                .catch(err => {
                    logger.warning(TAG, 'Failed to send message part 1, error: ' + err);
                });
            mem.sendMessage(emplore2)
                .then(() => {
                    logger.debug(TAG, 'Successfully sent message part 2 to member');
                })
                .catch(err => {
                    logger.warning(TAG, 'Failed to send message part 2, error: ' + err);
                });
            return false;
        } else {
            return true; // Sensible name
        }
    }
};

let madLad = 'You sir are an absolute madman, I\'m afraid I can\'t allow you to have \"@\" as the ' +
    'first character of your name as that would make life on discord very difficult. I\'ve changed ' +
    'your name for you but if you want to personalise your nickname on our server feel free to ' +
    'set your own nickname by right clicking on your username in chat. I strongly suggest an easy ' +
    'to spell one.' +
    '\n' +
    '\nTL;DR: Your name was unnaceptable.';

let emplore = 'Hi there, I\'ve noticed that the first 3 characters of your name contain impossibly ' +
    'hard to spell characters. You\'re welcome to keep your name if you choose but we would ' +
    'certainly prefer it if you were to change your name to a more user friendly alternative. An easy ' +
    'to spell name means that people won\'t have trouble inviting you to games or giving you the ' +
    'right permisions ingame and on discord. People will probably have an easier time pronouncing ' +
    'your name too.' +
    '\n' +
    '\nIdeal names have their first 3 characters alphanumerical. If it\'s not on this you\'re gunna cause ' +
    'problems: http://i.imgur.com/O5KVbGd.png';
let emplore2 = 'You can change your nickname by right-clicking on your username in chat' +
    '\n' +
    '\nTL;DR: We would appreciate it if your name was easier to spell.';
