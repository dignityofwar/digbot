const Command = require('./foundation/command');

module.exports = class PositionsCommand extends Command {
    constructor() {
        super();

        this.name = 'positions';
    }

    /**
     * @param message
     * @return {Promise<void>}
     */
    async execute(message) {
        return message.channel.send('This needs some work');
    }

    /**
     * @return {string}
     */
    help() {
        return 'PM a list of all channels and their associated position variables';
    }
};


// //  Copyright © 2018 DIG Development team. All rights reserved.
//
// 'use strict';
//
// // !positions module, PMs user with a list of channel positions
//
// const logger = require('../logger.js');
// const server = require('../server/server.js');
// const TAG = '!sort';
//
// module.exports = {
//     execute: function(member) {
//         if (server.getReady() !== true) {
//             return 'Sorry but server is currently not ready, please try again in a second';
//         }
//
//         let channels = server.getGuild().channels.array();
//         let message = '**Text channel positions**:';
//         for (let x in channels) {
//             if (channels[x].type === 'text') {
//                 message += '\n ' + channels[x].name + ': ' + channels[x].position;
//             }
//         }
//         sendMessageToMember(message, member);
//         message = '**Voice channel positions**:';
//         for (let x in channels) {
//             if (channels[x].type === 'voice') {
//                 message += '\n ' + channels[x].name + ': ' + channels[x].position;
//             }
//         }
//         sendMessageToMember(message, member);
//
//         return 'I\'ll PM you a list of channel positions';
//     }
// };
//
// function sendMessageToMember(message, member) {
//     member.sendMessage(message)
//         .then(
//             logger.debug(TAG, 'Succesfully sent message to member')
//         )
//         .catch(err => {
//             logger.warning(TAG, `Failed to send message to member, ${err}`);
//         });
// }
