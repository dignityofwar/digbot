//  Copyright © 2018 DIG Development team. All rights reserved.

'use strict';

const play = require('./play.js');

/* !help module, also assists in identification of command messages and provides lists of commands
    to other modules */

// Core commands with a short description
const messages = [
    '__Core Commands__:',
    '**!dragons**: #herebedragons is a private, lawless channel which you can opt into with this command.',
    '**!help (command)**: Will give a more detailed explanation of the command.',
    '**!help full**: Will PM you a full list of commands',
    '**!channel**: Used to create and delete temporary channels denoted by "-t-", works for both voice and text.',
    '**!ping**: Pong! Test if the bot is alive.',
    '**!poll**: Hold a short survey',
    '**!vote**: Vote in a !poll',
];

// Full list of commands with a short description
const fullMessage = [
    '__Full Command List__:',
    '**!help (command)**: Will give a more detailed explanation of the command.',
    '**!help full**: Will PM you a full list of commands',
    '**!catfacts**: Posts a random cat fact',
    '**!cats**: Shows a random cat image from the interwebs. Append "gif" on the end to return a gif version.',
    '**!channel**: Used to create and delete temporary channels denoted by "-t-", works for both voice and text.',
    '**!dragons**: #herebedragons is a private, lawless channel which you can opt into with this command. If you are ' +
    'already subscribed, use this command again to unsubscribe.',
    '**!lmgtfy**: Someone being lazy and not using Google? Generate them a link to use!',
    '**!mentions**: Check your DIG server mention allowance, resets daily',
    '**!ping**: Test if the bot is alive, check message -> bot pingtime.',
    '**!play**: Controls playing of music, use "!help play" for a more detailed explanation',
    '**!poll**: Hold a short survey',
    '**!sfx**: Play a sound effect in your voice channel',
    '**!started**: See how long the bot has been running for.',
    '**!stats**: Comes back with bot statistics. "Mildy interesting quantifiable data"',
    '**!vote**: Vote in a !poll',
];

// Complete list of commands with detailed description, note: as this is called by !help, help is excluded
const details = {
    catfacts: '**!catfacts**: Will return a random cat fact, drawing from a repository of over 100 cat facts!',
    cats: '**!cats**: This command will fetch a random cat image from the internet, it is capable of ' +
        'providing both gifs and images: ' +
        '\n"!cats" will return a random cat image ' +
        '\n"!cats gif" will return a random cat gif',
    channel: '**!channel**: This command will always be of the form !channel action type name' +
        '\n**Channel**: channel will never change, the command must be started with it' +
        '\n**Action**: The accepted actions are create and delete' +
        '\n**Type**: The type is either text or voice' +
        '\n**Name**: The name can be any alphanumerical name, must be 2-100 chars' +
        '\n**Example**: "!channel create text cats" will create the temporary text channel cats-t-',
    dragons: '**!dragons**: #herebedragons is a private, lawless channel which you can opt into ' +
        'with this command. If you are already subscribed, use this command again to unsubscribe.',
    lmgtfy: '**!lmgtfy** *<search term>*: Generates a link to http://lmgtfy.com (short for Let Me ' +
        'Google That For You) which you can use when people are being lazy and not Googling things.',
    mentions: '**!mentions**: Check the number of mentions you have remaining of your daily ' +
    'mentions allowance. This resets every 24 hour period. Be sure that you check if you\'re not sure ' +
    'to avoid getting in trouble for spamming',
    ping: '**!ping**: This is a classic command use the command "!ping" to get the bot to reply ' +
        '"pong", mainly used to test latency, i.e. ping',
    play: play.passList(),
    poll: '**!poll**: To start a poll use: "!poll Question? [answers]" note: [answers] is optional' +
        '\nThe poll will last 5-10 minutes, alternatively use "!poll X" to end it immediately' +
        '\nAfter the poll ends the bot will count the results and post them to the channel' +
        '\n**Example**: "!poll Do you like cats?"' +
        '\nTo make a poll multiple choice, or even single choice, use the [answer1, answer2] option' +
        '\n**Example**: "!poll Do you like cats or dogs more? [cats, dogs]"',
    sfx: '**!sfx**: Play a sound effect in your channel, for a full list of available SFX commands use "!sfx list"' +
        '\n**Example**: !sfx cena',
    started: '**!started**: Use "!started" to see when the bot started',
    stats: '**!stats**: Display bot statistics such as uptime, memory usage and number of servers.',
    vote: '**!vote**: To vote in a poll held in a channel you must use \'!vote option\' in that same channel ' +
        '\n**Example**: "!vote vanu"',
};

let fullNumber = 0; // To store number of messages needed to relay full command list
const fullMessageArray = []; // Array to store sections of full command list message

module.exports = {
    detailsPass(key) {
        return details[key];
    },

    // Runs on !help, returns core commands or number of messages needed to relay the full list
    execute(msg) {
        if (msg.content.substring(6) !== 'full') {
            for (const x in details) {
                if (msg.content.indexOf(x) !== -1) {
                    return details[x];
                }
            }
            return standard();
        }
        return fullNumber;
    },

    // Relay sections of full command list message, iterates through from discord.js
    helpFull(i) {
        if (fullMessageArray[i]) {
            return fullMessageArray[i];
        }
        return false;
    },

    pass() {
        return messages;
    },

    /* Called on bot.ready, calculate the number of discord messages needed to relay full command list
        also splits the full list up ready to be called in message format */
    ready() {
        for (let i = 0; i < fullMessage.length; i += 1) {
            if (i === 0) {
                fullMessageArray[fullNumber] = fullMessage[i];
            } else if (fullMessageArray[fullNumber].length + fullMessage[i].length + 2 < 2000) {
                if (i !== 0) { fullMessageArray[fullNumber] += '\n'; }
                fullMessageArray[fullNumber] += fullMessage[i];
            } else {
                fullNumber += 1;
                if (i !== 0) { fullMessageArray[fullNumber] = '\n'; }
                fullMessageArray[fullNumber] += fullMessage[i];
            }
        }
    },
};

// Formats core commands to be sent on !help
function standard() {
    let message = '';

    for (let i = 0; i < messages.length; i += 1) {
        message += `${messages[i]}\n`;
    }

    return message;
}
