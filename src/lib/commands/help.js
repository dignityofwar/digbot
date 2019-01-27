const { words } = require('lodash');
const Command = require('../core/command');

// TODO: Should be registered in the respective command
// const messages = [
//     '__Core Commands__:',
//     '**!help (command)**: Will give a more detailed explanation of the command.',
//     '**!help full**: Will PM you a full list of commands',
//     '**!channel**: Used to create and delete temporary channels denoted by "-t-", works for both voice and text.',
//     '**!poll**: Hold a short survey',
//     '**!vote**: Vote in a !poll',
// ];
//
// const fullMessages = [
//     '__Full Command List__:',
//     '**!help (command)**: Will give a more detailed explanation of the command.',
//     '**!help full**: Will PM you a full list of commands',
//     '**!channel**: Used to create and delete temporary channels denoted by "-t-", works for both voice and text.',
//     '**!play**: Controls playing of music, use "!help play" for a more detailed explanation',
//     '**!poll**: Hold a short survey',
//     '**!sfx**: Play a sound effect in your voice channel',
//     '**!vote**: Vote in a !poll',
// ];
//
// const details = {
//
//     CHANNEL: '**!channel**: This command will always be of the form !channel action type name'
//         + '\n**Channel**: channel will never change, the command must be started with it'
//         + '\n**Action**: The accepted actions are create and delete'
//         + '\n**Type**: The type is either text or voice'
//         + '\n**Name**: The name can be any alphanumerical name, must be 2-100 chars'
//         + '\n**Example**: "!channel create text cats" will create the temporary text channel cats-t-',
//     PLAY: '__**Play Command:**__'
//         + '\nAll commands are of the form !play command specification'
//         + '\n**Commands:**'
//         +
//         '\nvideo: Used to play the audio from a video in your channel, remember to supply the target (video ID after watch?v= in the url)'
//         + '\nplaylist: Play music from a playlist we have on file, or by youtube playlist ID'
//         +
//         '\nstop: This command will stop music currently streaming in your channel, please respect the channel owners and other people in your channel'
//         + '\nskip: This command will skip the current song if you\'re listening to a playlist'
//         +
//         '\nvolume: This command adjusts the playback volume of a bot palying in your channel, accepted specifications are up and down'
//         + '\n'
//         + '\n**Playlists:**'
//         + '\nfun - A random and diverse collection of songs that are fun rather than objectively good'
//         + '\nnightcore - Best of the daily nightcore series'
//         + '\n90\'s - Nineties pop songs'
//         + '\n00\'s - Noughties pop songs'
//         + '\n10\'s - Tennies pop songs'
//         + '\n'
//         + '\n**Examples:**'
//         + '\n!play video dQw4w9WgXcQ'
//         + '\n!play playlist nightcore'
//         + '\n!play playlist PLAEQD0ULngi67rwmhrkNjMZKvyCReqDV4'
//         + '\n!play stop'
//         + '\n!play skip'
//         + '\n!play volume down',
//     POLL: '**!poll**: To start a poll use: "!poll Question? [answers]" note: [answers] is optional'
//         + '\nThe poll will last 5-10 minutes, alternatively use "!poll X" to end it immediately'
//         + '\nAfter the poll ends the bot will count the results and post them to the channel'
//         + '\n**Example**: "!poll Do you like cats?"'
//         + '\nTo make a poll multiple choice, or even single choice, use the [answer1, answer2] option'
//         + '\n**Example**: "!poll Do you like cats or dogs more? [cats, dogs]"',
//     SFX: '**!sfx**: Play a sound effect in your channel, for a full list of available SFX commands use "!sfx list"'
//         + '\n**Example**: !sfx cena',
//     VOTE: '**!vote**: To vote in a poll held in a channel you must use \'!vote option\' in that same channel '
//         + '\n**Example**: "!vote vanu"',
// };

module.exports = class StatsCommand extends Command {
    constructor({ commandRegister }) {
        super();

        this.name = 'help';

        this.throttle = {
            attempts: 2,
            decay: 10,
        };

        this.register = commandRegister;
    }

    /**
     * @param message
     * @return {Promise<void>}
     */
    async execute(message) {
        if (this.wantsFull(message.cleanContent)) {
            return message.member.send(this.createDM());
        }

        // const commandMessage = this.wantsSomething(message.cleanContent);
        //
        // if (commandMessage) {
        //     return message.channel.send(commandMessage);
        // }

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
    // wantsSomething(content) {
    //     return get(details, (words(content)[1] || '').toUpperCase(), false);
    // }

    /**
     * @return {string}
     */
    createReply() {
        return this.register.commands.filter(({ onlyHelpFull, special }) => !onlyHelpFull && !special)
            .reduce(
                (message, { name, help }) => `${message}\n**!${name}**: ${help(false)}`,
                '__Core Commands__',
            );
    }

    /**
     * @return {string}
     */
    createDM() {
        return this.register.commands.filter(({ special }) => !special)
            .reduce(
                (message, { name, help }) => `${message}\n**!${name}**: ${help(true)}`,
                '__Core Commands__',
            );
    }

    /**
     * @return {string}
     */
    help() {
        return 'Will give a more detailed explanation of the command.';
    }
};
