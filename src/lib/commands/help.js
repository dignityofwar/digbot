const { get, words } = require('lodash');
const Command = require('../core/command');

// TODO: Should be registered in the respective command
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

const fullMessages = [
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

const details = {
    CATFACTS: '**!catfacts**: Will return a random cat fact, drawing from a repository of over 100 cat facts!',
    CATS: '**!cats**: This command will fetch a random cat image from the internet, it is capable of '
        + 'providing both gifs and images: '
        + '\n"!cats" will return a random cat image '
        + '\n"!cats gif" will return a random cat gif',
    CHANNEL: '**!channel**: This command will always be of the form !channel action type name'
        + '\n**Channel**: channel will never change, the command must be started with it'
        + '\n**Action**: The accepted actions are create and delete'
        + '\n**Type**: The type is either text or voice'
        + '\n**Name**: The name can be any alphanumerical name, must be 2-100 chars'
        + '\n**Example**: "!channel create text cats" will create the temporary text channel cats-t-',
    DRAGONS: '**!dragons**: #herebedragons is a private, lawless channel which you can opt into with this command. '
        + 'If you are already subscribed, use this command again to unsubscribe.',
    LMGTFY: '**!lmgtfy** *<search term>*: Generates a link to http://lmgtfy.com (short for Let Me Google That For You) '
        + 'which you can use when people are being lazy and not Googling things.',
    MENTIONS: '**!mentions**: Check the number of mentions you have remaining of your daily '
        + 'mentions allowance. This resets every 24 hour period. Be sure that you check if you\'re not sure '
        + 'to avoid getting in trouble for spamming',
    PING: '**!ping**: This is a classic command use the command "!ping" to get the bot to reply '
        + '"pong", mainly used to test latency, i.e. ping',
    PLAY: '__**Play Command:**__'
        + '\nAll commands are of the form !play command specification'
        + '\n**Commands:**'
        +
        '\nvideo: Used to play the audio from a video in your channel, remember to supply the target (video ID after watch?v= in the url)'
        + '\nplaylist: Play music from a playlist we have on file, or by youtube playlist ID'
        +
        '\nstop: This command will stop music currently streaming in your channel, please respect the channel owners and other people in your channel'
        + '\nskip: This command will skip the current song if you\'re listening to a playlist'
        +
        '\nvolume: This command adjusts the playback volume of a bot palying in your channel, accepted specifications are up and down'
        + '\n'
        + '\n**Playlists:**'
        + '\nfun - A random and diverse collection of songs that are fun rather than objectively good'
        + '\nnightcore - Best of the daily nightcore series'
        + '\n90\'s - Nineties pop songs'
        + '\n00\'s - Noughties pop songs'
        + '\n10\'s - Tennies pop songs'
        + '\n'
        + '\n**Examples:**'
        + '\n!play video dQw4w9WgXcQ'
        + '\n!play playlist nightcore'
        + '\n!play playlist PLAEQD0ULngi67rwmhrkNjMZKvyCReqDV4'
        + '\n!play stop'
        + '\n!play skip'
        + '\n!play volume down',
    POLL: '**!poll**: To start a poll use: "!poll Question? [answers]" note: [answers] is optional'
        + '\nThe poll will last 5-10 minutes, alternatively use "!poll X" to end it immediately'
        + '\nAfter the poll ends the bot will count the results and post them to the channel'
        + '\n**Example**: "!poll Do you like cats?"'
        + '\nTo make a poll multiple choice, or even single choice, use the [answer1, answer2] option'
        + '\n**Example**: "!poll Do you like cats or dogs more? [cats, dogs]"',
    SFX: '**!sfx**: Play a sound effect in your channel, for a full list of available SFX commands use "!sfx list"'
        + '\n**Example**: !sfx cena',
    STARTED: '**!started**: Use "!started" to see when the bot started',
    STATS: '**!stats**: Display bot statistics such as uptime, memory usage and number of servers.',
    VOTE: '**!vote**: To vote in a poll held in a channel you must use \'!vote option\' in that same channel '
        + '\n**Example**: "!vote vanu"',
};

module.exports = class StatsCommand extends Command {
    constructor() {
        super();

        this.name = 'help';
    }

    /**
     * @param message
     * @return {Promise<void>}
     */
    async execute(message) {
        if (this.wantsFull(message.cleanContent)) {
            return message.member.send(this.createDM());
        }

        const commandMessage = this.wantsSomething(message.cleanContent);

        if (commandMessage) {
            return message.channel.send(commandMessage);
        }

        return message.channel.send(this.createReply());
    }

    /**
     * @param content
     * @return {boolean}
     */
    wantsFull(content) {
        return (words(content)[1] || '').toUpperCase() === 'FULL';
    }

    /**
     * @param content
     */
    wantsSomething(content) {
        return get(details, (words(content)[1] || '').toUpperCase(), false);
    }

    /**
     * @return {string}
     */
    createReply() {
        return messages.reduce((a, b) => `${a}\n${b}`);
    }

    /**
     * @return {string}
     */
    createDM() {
        return fullMessages.reduce((a, b) => `${a}\n${b}`);
    }
};
