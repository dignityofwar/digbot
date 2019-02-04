const Command = require('../core/command');

module.exports = class PollCommand extends Command {
    constructor() {
        super();

        this.name = 'poll';
    }

    /**
     * @param message
     * @return {Promise<void>}
     */
    async execute(message) {
        return message.channel.send('Miep');
    }

    /**
     * @return {string}
     */
    help() {
        return 'Hold a short survey';
    }
};


// //  Copyright © 2018 DIG Development team. All rights reserved.
//
// 'use strict';
//
// // !poll and !vote module
//
// const logger = require('../logger.js');
// const TAG = '!poll';
//
// let votes = {};
// let possitiveResponses = [
//     'yes',
//     'y',
//     'aye',
//     'yeah',
//     'yup',
//     'yep',
//     'sure',
//     'of course',
//     'course',
//     'affirmative',
//     'certainly',
//     'definately',
//     'indubitably',
//     'positively',
//     'undoubtedly',
//     'unquestionably',
//     'uhuh',
//     'absolutely',
//     'assuredly',
//     'agreed',
//     'yea',
//     'nod',
//     'agree',
//     'i agree',
//     'yay',
//     'si'
// ];
// let negativeResponses = [
//     'n',
//     'no',
//     'negative',
//     'nah',
//     'neh',
//     'neigh',
//     'nix',
//     'never',
//     'no way',
//     'not at all',
//     'veto',
//     'nope',
//     'nay'
// ];
//
// module.exports = {
//     // Check if a poll is due to end, if so automatically end it, called from admin.js
//     check: function() {
//         let result = false;
//         for (let x in votes) {
//             if (typeof votes[x] === 'object') {
//                 if (Date.now() - votes[x].startTime > 300000) {
//                     endVoteAuto(x);
//                     result = true;
//                 }
//             }
//         }
//         return result; // True if at least one poll is ending
//     },
//
//     // Runs on !poll
//     execute: function(msg) {
//         let reply = checkOptions(msg);
//         if (typeof reply === 'string') {
//             return reply;
//         } else if (reply === false) {
//             reply = checkEnd(msg);
//             if (reply != false) {return reply;}
//             reply = checkOngoing(msg);
//             if (reply != false) {return reply;}
//             reply = checkQuestion(msg);
//             if (reply != false) {return reply;}
//             reply = setupVote(msg);
//             return reply;
//         } else {
//             let n = reply;
//             reply = checkEnd(msg);
//             if (reply != false) {return reply;}
//             reply = checkOngoing(msg);
//             if (reply != false) {return reply;}
//             reply = setupVote(msg, n);
//             return reply;
//         }
//     },
//
//     // Runs on !vote
//     vote: function(msg) {
//         if (typeof votes[msg.channel.id] !== 'object') {
//             return 'There currently isn\'t a vote ongoing in this channel, please vote in the same channel ' +
//                 'that the poll was called in.';
//         }
//         if (votes[msg.channel.id].voted.indexOf(msg.author.id) !== -1) {
//             return 'Your vote has already been counted ' + msg.member.displayName +
//                 '.';
//         }
//         if (msg.content.length < 7) {
//             return 'You need to say what you\'re voting for  ' + msg.member.displayName +
//                 '\nExample: \"!poll Do you like cats?\"';
//         }
//         if (votes[msg.channel.id].options === false) {
//             votes[msg.channel.id].voted += msg.author.id;
//             if (possitiveResponses.indexOf(msg.content.substring(6).toLowerCase()) != -1) {
//                 if (!votes[msg.channel.id].count.hasOwnProperty('yes')) {
//                     votes[msg.channel.id].count.yes = 0;
//                 }
//                 votes[msg.channel.id].count.yes += 1;
//                 return 'Thanks for voting ' + msg.member.displayName + '.';
//             }
//             if (negativeResponses.indexOf(msg.content.substring(6).toLowerCase()) != -1) {
//                 if (!votes[msg.channel.id].count.hasOwnProperty('no')) {
//                     votes[msg.channel.id].count.no = 0;
//                 }
//                 votes[msg.channel.id].count.no += 1;
//                 return 'Thanks for voting ' + msg.member.displayName + '.';
//             }
//             if (votes[msg.channel.id].count.hasOwnProperty(msg.content.substring(6).toLowerCase())) {
//                 votes[msg.channel.id].count[msg.content.substring(6).toLowerCase()] += 1;
//             } else {
//                 votes[msg.channel.id].count[msg.content.substring(6).toLowerCase()] = 1;
//             }
//             return 'Thanks for voting ' + msg.member.displayName + '.';
//         } else if (typeof votes[msg.channel.id].options[0] === 'string') {
//             if (votes[msg.channel.id].options.indexOf(msg.content.substring(6)) != -1) {
//                 votes[msg.channel.id].voted += msg.author.id;
//                 votes[msg.channel.id].count[msg.content.substring(6).toLowerCase()] += 1;
//                 return 'Thanks for voting ' + msg.member.displayName + '.';
//             } else {
//                 let message = 'Sorry ' + msg.member.displayName +
//                     ', this is a multiple choice poll, acceptable answers are: ';
//                 let i = 0;
//                 for (i = 0; i < votes[msg.channel.id].options.length; i++) {
//                     if (i != 0) {
//                         message += ', ';
//                     }
//                     message += votes[msg.channel.id].options[i];
//                 }
//                 return message;
//             }
//         }
//         return 'Sup';
//     }
// };
//
// // Check if the msg is attempting to end the vote, respond accordingly if so
// function checkEnd(msg) {
//     if (msg.content.substring(6) !== 'x' && msg.content.substring(6) !== 'X') {return false;}
//     if (typeof votes[msg.channel.id] !== 'object') {
//         return 'There does not seem to currently be an ongoing vote in this channel.';
//     }
//     if (msg.author.id !== votes[msg.channel.id].msg.author.id) {
//         return 'Sorry ' + msg.member.displayName +
//             ', votes can only be ended early by the person that called them.';
//     }
//     return endVoteManual(msg.channel.id);
// }
//
// // If a poll is currently ongoing in the channel return true and send an error message
// function checkOngoing(msg) {
//     if (typeof votes[msg.channel.id] === 'object') {
//         return 'Sorry there is already an ongoing poll in this channel, please wait for it to finish ' +
//             'before starting another.';
//     };
//     return false;
// }
//
// // Returns number of specified options, false if none, string if error
// function checkOptions(msg) {
//     if (msg.content.indexOf('?') === -1 && msg.content.substring(6) !== 'x' && msg.content.substring(6) !== 'X') {
//         return 'You must use a question mark (?) at the end of your question in !poll question options ' +
//             '\nExample: !poll Do you like cats? [yes, no, abstain]';
//     }
//     if (msg.content.replace(/[^?]/g, '').length > 1) {
//         return 'You may only use one question mark in the poll command for example the command ' +
//             '\"!poll What is your favourite character? [?, @, .] would not be valid';
//     }
//     if (msg.content.replace(/\s+/g, '').indexOf('?') + 1 < msg.content.replace(/\s+/g, '').length) {
//         if (msg.content.length > 7 && msg.content.indexOf('?') !== msg.content.indexOf('[') - 2) {
//             return 'Please check you have formatted the command correctly, Example: \"!poll like cats? [yes, no]\"';
//         }
//         let options = msg.content.substring(msg.content.indexOf('?') + 3, msg.content.length - 1)
//             .replace(/\s+/g, '');
//         let n = options.replace(/[^,]/g, '').length + 1;
//         let i = 0;
//         for (i = 0; i < n - 1; i++) {
//             if (options.indexOf(',') === 0) {
//                 return 'It looks like one of your options is blank [yes, ,no] for example, is not acceptable';
//             }
//             options = options.substring(options.indexOf(',') + 1);
//             if (options.length === 0) {
//                 return 'It looks like one of your options is blank [yes, ,no] for example, is not acceptable';
//             }
//         }
//         return n;
//     } else {
//         return false;
//     }
// }
//
// // If a question is not suitable return true and specify what a better question would be
// function checkQuestion(msg) {
//     if (msg.content.substring(6).length < 8) {
//         return 'Error: Questions must be longer than 8 characters long.';
//     }
//     return false;
// }
//
// //End a vote automatically, reply is sent using the .reply() method stored in the message object
// function endVoteAuto(id) {
//     let message = '**Poll Ended!**' +
//         '\n__Question:__ ' + votes[id].question +
//         '\n__Results:__';
//     let x = 0;
//     let participation = false;
//     for (x in votes[id].count) {
//         message += '\n' + x + ': ' + votes[id].count[x];
//         participation = true;
//     }
//     if (participation == false) {
//         message += '\nAnd not a single vote was cast this day.';
//     }
//     votes[id].msg.reply(message);
//     delete votes[id];
//     logger.info(TAG, 'Vote ended automatically as time expired in channel ' + id);
// }
//
// // End a vote manually, reply is fed up via reply variable and sent from discordbot.js
// function endVoteManual(id) {
//     let message = '**Poll Ended!**' +
//         '\n__Question:__ ' + votes[id].question +
//         '\n__Results:__';
//     let x = 0;
//     let participation = false;
//     let total = 0;
//     for (x in votes[id].count) {
//         total += votes[id].count[x];
//     }
//     for (x in votes[id].count) {
//         message += '\n' + x + ': ' + votes[id].count[x] + ' (' +
//             Math.round(100 * (votes[id].count[x] / total)) + '%)';
//         participation = true;
//     }
//     if (participation === false) {
//         message += '\nAnd not a single vote was cast this day.';
//     }
//     delete votes[id];
//     logger.info(TAG, 'Vote ended manually by user in ' + id);
//     return message;
// }
//
// // Configure vote object
// function setupVote(msg, n) {
//     let message = '**Poll Started!**: *' + msg.content.substring(6) + '*' +
//         '\nTo vote use the !vote command, Examples: \"!vote yes\", \"!vote blue\"' +
//         '\nThe vote will last 5 minutes or until ' + msg.member.displayName +
//         ' ends the vote early with: \"!poll x\"';
//     votes[msg.channel.id] = {};
//     votes[msg.channel.id].msg = msg;
//     votes[msg.channel.id].question = msg.content.substring(6, msg.content.indexOf('?') + 1);
//     votes[msg.channel.id].startTime = Date.now();
//     votes[msg.channel.id].voted = [];
//     votes[msg.channel.id].count = {};
//     votes[msg.channel.id].options = false;
//     logger.info(TAG, 'Vote called by ' + msg.member.displayName + ' in ' +
//         msg.channel.id);
//     if (typeof n === 'number') {
//         message += '\nThis is a multiple choice poll, only the specified replies will be counted.' +
//             '\nOptions:';
//         votes[msg.channel.id].options = [];
//         let optionsString = msg.content.substring(msg.content.indexOf('?') + 3, msg.content.length - 1).replace(/\s+/g, '');
//         if (optionsString.length > 2) {
//             let i = 0;
//             let x = 0;
//             let option = '';
//             for (i = 0; i < n; i++) {
//                 x = optionsString.indexOf(',');
//                 if (x === -1) {
//                     votes[msg.channel.id].options.push(optionsString);
//                     votes[msg.channel.id].count[optionsString] = 0;
//                     message += ' ' + optionsString;
//                 } else {
//                     option = optionsString.substring(0, x);
//                     votes[msg.channel.id].options.push(option);
//                     votes[msg.channel.id].count[option] = 0;
//                     message += ' ' + option + ',';
//                 }
//                 optionsString = optionsString.substring(optionsString.indexOf(',') + 1);
//             }
//         } else {
//             let options = ['yes', 'no', 'abstain'];
//             votes[msg.channel.id].options = options;
//             for (let x in options) {
//                 votes[msg.channel.id].count[options[x]] = 0;
//             }
//             message += ' yes, no, abstain';
//         }
//     }
//     return message;
// }
