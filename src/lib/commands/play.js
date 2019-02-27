const config = require('config');
const { google } = require('googleapis');
const ytdl = require('ytdl-core');

const Command = require('./foundation/command');

const antiDuplicate = require('../util/antiduplicate.js');
const crashHandler = require('../crash-handling.js');
const logger = require('../logger.js');
const playAssets = require('../../assets/music/play-assets.js');
const server = require('../server/server.js');
const subBots = require('../sub-bots/sub-bots.js');

const TAG = '!play';

const youtube = google.youtube({
    version: 'v3',
    auth: config.get('youtubeKey'),
}); // create youtube API client

const root = 'https://www.youtube.com/watch?v=';


const playing = {};
const verified = {
    external: {},
    local: {},
};

let failing = false;

module.exports = class PlayCommand extends Command {
    constructor() {
        super();

        this.name = 'play';
    }

    async execute({ message: msg }) { // eslint-disable-line consistent-return
        failing = false;
        if (!config.get('features.play')) {
            sendMessageToChannel(msg.channel, 'Sorry this feature has been disabled');
            return false;
        }

        if (msg.content.length === 5 || msg.content.substring(6) === ' ') {
            sendMessageToChannel(msg.channel,
                'Please provide a valid command. E.g. !play **video** dQw4w9WgXcQ');
            return false;
        }

        if (msg.content.substring(6) === 'list' || msg.content.substring(6) === 'help') {
            list(msg);
            return true;
        }

        if (!msg.member.voiceChannel) {
            sendMessageToChannel(msg.channel, 'Please be in a voice channel first!');
            return false;
        }

        if (msg.content.substring(6).startsWith('video')) {
            /* This bit will help dramatically cut down on grief not only from different kinds of youtube
            links but also from people trying to link sound clouds and such */
            if (
                msg.content.substring(12).indexOf('http:') !== -1
                || msg.content.substring(12).indexOf('www.') !== -1
                || msg.content.substring(12).indexOf('youtube') !== -1
                || msg.content.substring(12).indexOf('playlist') !== -1
                || msg.content.substring(12).indexOf('time') !== -1
            ) {
                logger.info(TAG, 'Recieved a bad request for a video');
                sendMessageToChannel(msg.channel, `Sorry ${msg.member.displayName}, but I `
                    + 'can only accept requests by youtube video ID, (the ID after watch?v= in the url)');
                return false;
            }

            const source = root + msg.content.substring(12);
            const requester = msg.member.displayName;
            if (!playing[msg.member.voiceChannel.id]) {
                setup(msg, 'video', {
                    source,
                    requester,
                });
            } else {
                playing[msg.member.voiceChannel.id].videoQueue.push({
                    source,
                    requester,
                });
                logger.info(TAG, `${msg.member.displayName} added ${msg.content.substring(12)} 'to the queue`);
                sendMessageToChannel(
                    msg.channel,
                    `Your video has been added to the queue ${msg.member.displayName}, Queue length: `
                    + `${playing[msg.member.voiceChannel.id].videoQueue.length}`,
                );

                return true;
            }
        } else if (msg.content.substring(6).startsWith('playlist')) {
            if (!playAssets.pass[msg.content.substring(15)]) {
                if (
                    msg.content.substring(15).indexOf('http:') !== -1
                    || msg.content.substring(15).indexOf('www.') !== -1
                    || msg.content.substring(15).indexOf('youtube') !== -1
                    || msg.content.substring(15).indexOf('playlist') !== -1
                    || msg.content.substring(15).indexOf('time') !== -1
                    || msg.content.substring(15).indexOf('/') !== -1
                    || msg.content.substring(15).indexOf('video') !== -1
                ) {
                    logger.info(TAG, 'Received a bad request for a playlist');
                    sendMessageToChannel(
                        msg.channel, `Sorry ${msg.member.displayName}, but I `
                        + 'can only accept requests by youtube playlist ID, (the ID after playlist?list= in the url)',
                    );
                    return false;
                }
                searchForPlaylist(msg);
                return true;
            }
            sendMessageToChannel(
                msg.channel,
                `Now playing *${msg.content.substring(15)}* `
                + `playlist in ${msg.member.voiceChannel.name}, use "!play stop" to stop playback`,
            );
            setup(msg, 'playlist', msg.content.substring(15));
            return true;
        } else if (msg.content.substring(6)
            .startsWith('stop')) {
            if (
                playing[msg.member.voiceChannel.id]
                && playing[msg.member.voiceChannel.id].connection
            ) {
                logger.info(TAG, `Ending playback in channel: ${msg.member.voiceChannel.name} on `
                    + `request by ${msg.member.displayName}`);
                sendMessageToChannel(msg.channel, `Stopping playback in ${msg.member.voiceChannel.name}`);
                playEnd(msg.member.voiceChannel.id);
                return true;
            }
            logger.info(TAG, `${msg.member.displayName} asked to end playback in `
                + `${msg.member.voiceChannel.name} but there is no bot playing in that channel`);
            sendMessageToChannel(msg.channel, `Sorry ${msg.member.displayName} there `
                + 'don\'t appear to be any songs playing in your channel');
            return false;
        } else if (msg.content.substring(6)
            .startsWith('skip')) {
            if (
                playing[msg.member.voiceChannel.id]
                && playing[msg.member.voiceChannel.id].connection
            ) {
                logger.info(TAG, `Skipping to next song in channel: ${msg.member.voiceChannel.name} `
                    + `on request by ${msg.member.displayName}`);
                sendMessageToChannel(msg.channel, `Skipping to next song in ${msg.member.voiceChannel.name}`);
                skip(msg.member.voiceChannel.id);
                return true;
            }
            logger.info(TAG, `${msg.member.displayName} asked to skip song in `
                + `${msg.member.voiceChannel.name} but there is no bot playing in that channel`);
            sendMessageToChannel(msg.channel, `Sorry ${msg.member.displayName} there `
                + 'don\'t appear to be any songs playing in your channel');
            return false;
        } else if (msg.content.substring(6).startsWith('volume')) {
            let specification = '';
            if (msg.content.substring(13).startsWith('up')) {
                specification = 'up';
            } else if (msg.content.substring(13).startsWith('down')) {
                specification = 'down';
            } else {
                logger.info(TAG, `Recieved request to change volume in ${msg.member.voiceChannel.name} `
                    + `by ${msg.member.displayName}, but specification not recognised`);
                sendMessageToChannel(msg.channel, `Sorry ${msg.member.displayName} but I don't `
                    + 'recognise that specification, please use "up" or "down" to specify a change in volume');
                return false;
            }
            if (
                playing[msg.member.voiceChannel.id]
                && playing[msg.member.voiceChannel.id].connection
            ) {
                if (specification === 'up') {
                    logger.info(TAG, `Recieved request from ${msg.member.displayName} to raise `
                        + `volume in ${msg.member.voiceChannel.name}`);
                    sendMessageToChannel(
                        msg.channel,
                        `Raising playback volume in ${msg.member.voiceChannel.name}`,
                    );
                } else {
                    logger.info(TAG, `Recieved request from ${msg.member.displayName} to lower `
                        + `volume in ${msg.member.voiceChannel.name}`);
                    sendMessageToChannel(
                        msg.channel,
                        `Lowering playback volume in ${msg.member.voiceChannel.name}`,
                    );
                }
                volume(msg.member.voiceChannel.id, specification);
                return true;
            }
            logger.info(TAG, `${msg.member.displayName} asked to change volume in `
                + `${msg.member.voiceChannel.name} but there is no bot playing in that channel`);
            sendMessageToChannel(msg.channel, `Sorry ${msg.member.displayName} there `
                + 'don\'t appear to be any songs playing in your channel');
            return false;
        } else {
            sendMessageToChannel(msg.channel, 'Sorry I didn\'t recognise that command, please '
                + 'use "!help play" for a more detailed explanation of the command if you\'re confused');
            return false;
        }
    }

    /**
     * @return {string}
     */
    help() {
        return 'Controls playing of music'; // TODO: Better help stuff
    }

    // Passess an explanation of the command
    static passList() {
        if (!config.get('features.play')) { return false; }

        let message = '__**Play Command:**__'
            + '\nAll commands are of the form !play command specification'
            + '\n**Commands**:'
            + '\nvideo: Used to play the audio from a video in your channel, remember to '
            + 'supply the target (video ID after watch?v= in the url)'
            + '\nplaylist: Play music from a playlist we have on file, or by youtube playlist ID'
            + '\nstop: This command will stop music currently streaming in your channel, please '
            + 'respect the channel owners and other people in your channel'
            + '\nskip: This command will skip the current song if you\'re listening to a playlist'
            + '\nvolume: This command adjusts the playback volume of a bot palying in your channel, '
            + 'accepted specifications are *up* and *down*'
            + '\n'
            + '\n**Playlists:**';

        for (const description of playAssets.pass) {
            message += `\n${description}`;
        }

        message += '\n'
            + '\n**Examples:**'
            + '\n*!play video dQw4w9WgXcQ*'
            + '\n*!play playlist nightcore*'
            + '\n*!play playlist PLAEQD0ULngi67rwmhrkNjMZKvyCReqDV4*'
            + '\n*!play stop*'
            + '\n*!play skip*'
            + '\n*!play volume down*';

        return message;
    }

    // Called on bot start then every 24 hours
    static ready() {
        if (!config.get('features.play')) { return; }
        verified.external = {}; // Wipe cached external verified commands
        verifyLocal();
    }
};

// Terminates the current connection and stream dispatcher if there is one for a channel
function kill(x, remove) {
    if (playing[x].dispatcher) {
        const temp = playing[x].dispatcher;
        playing[x].dispatcher = false;
        temp.end();
    }
    if (playing[x].connection) {
        const temp = playing[x].connection;
        playing[x].connection = false;
        temp.disconnect();
    }
    if (remove) {
        delete playing[x];
    }
}

// Send the user a list of all available sound effects
function list(msg) {
    sendMessageToChannel(msg.channel, module.exports.passList());
    return true;
}

// Called after the command has been verified, connects to channel and outsources streaming
function play() {
    if (config.util.getEnv('NODE_ENV') === 'testing') { return false; }
    if (server.getReady() === false) {
        logger.debug(TAG, 'Server not ready, setting play on timeout');
        setTimeout(() => {
            crashHandler.logEvent(TAG, 'server not ready setTimeout in play()');
            logger.debug(TAG, 'Calling play again');
            play();
        }, 10000);
        return false;
    }
    logger.info(TAG, 'Play function called');
    crashHandler.logEvent(TAG, 'play');

    for (const x in playing) {
        if (playing[x].bot && playing[x].connection && !playing[x].busy) {
            continue; // eslint-disable-line no-continue
        }
        playing[x].busy = true;

        // Join channel and begin playback by calling playNext()
        playing[x].bot.channels.get(x)
            .join()
            .then((connection) => {
                playing[x].busy = false;
                playing[x].connection = connection;
                logger.debug(TAG, `Connected sub bot: ${playing[x].bot.user.id} to channel: `
                    + `${playing[x].bot.channels.get(x).name}`);

                /* If disconnect cancel all playback in that channel, could be some dingbat kicked it from
                the channel or something and doesn't understand the commands */
                connection.on('disconnect', () => {
                    logger.debug(TAG, `Disconected from channel: ${server.getGuild().channels.get(x).name}`);
                    playEnd(x);
                });

                connection.on('error', (err) => {
                    kill(x);
                    setTimeout(() => {
                        crashHandler.logEvent(TAG, 'error setTimeout in play()');
                        play();
                    }, 15000);
                    logger.warning(TAG, `Error from connection: ${err}`);
                });

                playNext(x, connection);
            })
            .catch((err) => {
                playing[x].busy = false;
                logger.warning(TAG, `voiceChannel.join promise rejected, error: ${err}`);
                playing[x].bot.channels.get(x)
                    .leave();
                kill(x);
                setTimeout(() => {
                    crashHandler.logEvent(TAG, 'catch setTimeout in play()');
                    play();
                }, 15000);
            });
    }
    return true;
}

// Ends playback in a channel specified by ID x
function playEnd(x) {
    if (playing[x].ending) { return; }
    playing[x].ending = true;
    logger.info(TAG, `Ending playback in ${server.getGuild().channels.get(x).name}`);
    subBots.logout(playing[x].bot);
    kill(x, true);
}

// Plays the next song in the channel x, this function runs when there is a connection and controls continuous playback
function playNext(x) {
    if (!playing[x] || playing[x].ending) {
        return false;
    }
    if (server.getReady() === false) {
        setTimeout(() => {
            crashHandler.logEvent(TAG, 'server not ready setTimeout in playNext()');
            playNext(x);
        }, 3000);
        return false;
    }
    logger.debug(TAG,
        `Play next called for channel: ${server.getGuild().channels.get(x).name} with bot ${playing[x].bot.user.id}`);
    if (!playing[x].bot) {
        logger.error(TAG, 'playNext() called but no sub bot was provided');
    }
    if (!playing[x].connection) {
        logger.error(TAG, 'playNext() called but no connection was provided');
    }

    let source = '';
    let options = {};
    let y = null;
    if (playing[x].videoQueue.length === 0) {
        if (playing[x].playlist && playing[x].playlist !== 'youtube') {
            y = antiDuplicate.randomise(x, Object.keys(playAssets.pass[playing[x].playlist].playlist));
            source = playAssets.pass[playing[x].playlist].playlist[y].link;
            if (!verifyCheck(source, 'local')) {
                playNext(x);
                return false;
            }
            options = {
                passess: 2,
                volume: playAssets.pass[playing[x].playlist].playlist[y].volume * playing[x].volume,
            };
            playing[x].playingStatus = `${playAssets.pass[playing[x].playlist].playlist[y].name}`
                + ` - ${playing[x].playlist} playlist`;
        } else if (playing[x].playlist && playing[x].playlist === 'youtube') {
            y = antiDuplicate.randomise(x, playing[x].youtubePlaylist);
            if (!verifyCheck(y, 'external')) {
                if (failing) {
                    logger.warning(TAG, `Detected failure in channel ${x}, could not verify ${y}`);
                    playEnd(x);
                    return false;
                }
                verify('external', y);
                failing = true;
                setTimeout(() => {
                    playNext(x);
                }, 3000);
                return false;
            }
            source = root + y;
            options = {
                passess: 2,
                volume: 0.025,
            };
            playing[x].playingStatus = `${playing[x].youtubePlaylistRequester}'s youtube playlist`;
        } else {
            playEnd(x);
            return false;
        }
    } else {
        source = playing[x].videoQueue[0].source; // eslint-disable-line prefer-destructuring
        if (!verifyCheck(source, 'external')) {
            if (failing) {
                logger.warning(TAG, `Detected failure in channel ${x}, could not verify ${y}`);
                playEnd(x);
                return false;
            }
            verify('external', source);
            failing = true;
            setTimeout(() => {
                playNext(x);
            }, 3000);
            return false;
        }
        options = {
            passess: 2,
            volume: 0.025,
        };
        playing[x].playingStatus = `${playing[x].videoQueue[0].requester}'s song request`;
        playing[x].videoQueue.splice(0, 1);
    }

    const stream = ytdl(source, { audioonly: true });
    const dispatcher = playing[x].connection.playStream(stream, options);
    playing[x].dispatcher = dispatcher;

    dispatcher.on('end', () => {
        if (playing[x] && playing[x].bot && !playing[x].ending) {
            logger.debug(TAG, `Dispatcher end event for sub bot: ${playing[x].bot.user.id}`);
            playing[x].dispatcher = false;
            playNext(x);
        }
    });

    dispatcher.on('start', () => {
        logger.debug(TAG, `Dispatcher start event for sub bot: ${playing[x].bot.user.id}`);
        logger.info(TAG, `Started playing song in ${server.getGuild().channels.get(x).name}`);
        playing[x].bot.user.setPresence({ game: { name: playing[x].playingStatus } })
            .then((user) => {
                logger.info(TAG, `Successfully updated sub bot: ${playing[x].bot.user.id} clientUser's `
                    + `presence to ${user.presence.game.name}`);
            })
            .catch((err) => {
                logger.warning(TAG, `Failed to update clientUser's presence, ${err}`);
            });
    });

    dispatcher.on('error', (err) => {
        if (playing[x] && playing[x].bot) {
            logger.debug(TAG, `Dispatcher error event for sub bot: ${playing[x].bot.user.id}`);
            playing[x].dispatcher = false;
            playNext(x);
            logger.warning(TAG, `Error while playing song in ${server.getGuild().channels.get(x).name}, ${err}`);
        }
    });

    return true;
}

/* Makes an API request for youtube, the playlist wasn't found locally so assume they handed us
a playlist ID */
function searchForPlaylist(msg) {
    const params = {
        fields: 'items/snippet/resourceId/videoId',
        maxResults: 50,
        part: 'snippet',
        playlistId: msg.content.substring(15),
    };

    youtube.playlistItems.list(params)
        .then((response) => {
            const youtubePlaylist = [];
            for (const { snippet } of response.data.items) {
                youtubePlaylist.push(snippet.resourceId.videoId);
            }
            setup(msg, 'playlist', 'youtube', youtubePlaylist);
        })
        .catch((err) => {
            if (String(err)
                .indexOf('cannot be found') !== -1) {
                sendMessageToChannel(msg.channel, `Sorry ${msg.member.displayName}, it `
                    + 'doesn\'t look like you\'ve provided a local playlist nor a valid youtube playlist ID. '
                    + 'please check your specified playlist and try again');
            } else {
                sendMessageToChannel(msg.channel, `Sorry ${msg.member.displayName}, your `
                    + 'playlist request encountered an unexpected error, please try again');
                logger.warning(TAG, `Failed to retrieve youtube playlist: ${err}`);
            }
        });
}

// Function to send messages to channels, optional promise functionality to get the new message back
function sendMessageToChannel(channel, message, promise) {
    if (promise === true) {
        return new Promise((resolve, reject) => {
            channel.sendMessage(message)
                .then((botMessage) => {
                    logger.debug(TAG, `Succesfully sent message: ${message}`);
                    resolve(botMessage);
                })
                .catch((err) => {
                    logger.warning(TAG, `Failed to send message to channel, ${err}`);
                    reject(err);
                });
        });
    }

    return channel.sendMessage(message)
        .then(() => {
            logger.debug(TAG, `Succesfully sent message: ${message}`);
        })
        .catch((err) => {
            logger.warning(TAG, `Failed to send message to channel, ${err}`);
        });
}

// Configures playing object for playback
function setup(msg, command, target, youtubePlaylist) {
    const channel = msg.member.voiceChannel.id;
    if (playing[channel] && playing[channel].busy) {
        setTimeout(() => {
            crashHandler.logEvent(TAG, 'channel object busy setTimeout in setup()');
            setup(msg, command, target);
        }, 2000);
        return;
    }
    if (!playing[channel]) {
        playing[channel] = {
            busy: true,
            volume: 1,
            videoQueue: [],
        };
    } else {
        playing[channel].busy = true;
    }
    if (command === 'playlist') {
        playing[channel].playlist = target;
        if (target === 'youtube') {
            playing[channel].youtubePlaylist = youtubePlaylist;
            playing[channel].youtubePlaylistRequester = msg.member.displayName;
        }
    } else if (command === 'video') {
        playing[channel].videoQueue.push(target);
    }
    verifyChannel(channel);
    if (!playing[channel].bot) {
        subBots.passBot()
            .then((bot) => {
                playing[channel].bot = bot;
                playing[channel].busy = false;
                if (server.getGuild()
                    .members
                    .get(bot.user.id).voiceChannel) {
                    bot.channels.get(server.getGuild()
                        .members
                        .get(bot.user.id).voiceChannel.id)
                        .leave();
                    kill(channel);
                    setTimeout(() => {
                        crashHandler.logEvent(TAG, 'if bot already in channel setTimeout in setup()');
                        play();
                    }, 3000);
                } else {
                    play();
                }
            })
            .catch((err) => {
                /* If the bot encounters errors they'll be thrown from the sub bot module and ride up here
                so we need to account for different types of errors */
                if (
                    err.toString().indexOf('ReferenceError') === -1
                    && err.toString().indexOf('TypeError') === -1
                ) {
                    logger.info(TAG, `Sub bot request rejected, retrying... Error: ${err}`);
                    playing[channel].busy = false;
                    setTimeout(() => {
                        crashHandler.logEvent(TAG, 'catch setTimeout in setup()');
                        setup(msg, command, target);
                    }, 5000);
                } else {
                    logger.error(TAG, `Sub bot encountered an error, ${err}`);
                }
            });
    } else {
        playing[channel].busy = false;
    }
}

/* Skips to next song by ending dispatcher, playNext will recieve the dispatcher end event and work
exactly the same as if the dispather ended due to the song ending */
function skip(x) {
    if (playing[x].dispatcher) {
        logger.debug(TAG, 'Ending dispatcher manually');
        playing[x].dispatcher.end();
    } else {
        logger.info(TAG, 'Recieved request to skip to next song, but the song was ending anyway');
    }
}

// Provided with a bad video ID, this function finds what local asset it belongs to and fires a warning
function track(source) {
    for (const x in playAssets.pass) {
        for (const y in playAssets.pass[x].playlist) {
            if (playAssets.pass[x].playlist[y].link.indexOf(source) !== -1) {
                logger.warning(TAG, `Bad link detected for local playlist: ${x} track: `
                    + `${y} song: ${playAssets.pass[x].playlist[y].name}`);
            }
        }
    }
}

// Raises or lowers volume for a bot playing in a channel
function volume(x, specification) {
    let change = null;
    if (specification === 'up') {
        change = 0.2;
    } else {
        change = -0.2;
    }
    const current = playing[x].volume;
    playing[x].volume += change;
    if (playing[x].dispatcher) {
        const newVolume = (playing[x].dispatcher.volume / current) * playing[x].volume;
        logger.debug(TAG, `Calculated new palyback volume to be: ${newVolume} requesting change`);
        playing[x].dispatcher.setVolume(newVolume);
    }
}

// Verify if a video is streamable
function verify(location, source) {
    if (source.indexOf('?v=') !== -1) {
        source = source.substring((source.indexOf('?v=') + 3)); // eslint-disable-line no-param-reassign
    }
    // No need to verify pre-verified external sources
    if (location === 'external' && verified.external[source]) { return; }
    const params = {
        part: 'snippet',
        id: source,
    };
    youtube.videos.list(params)
        .then((response) => {
            if (response.data.pageInfo.totalResults === 0) {
                if (location === 'local') {
                    track(source);
                }
                verified[location][source] = false;
            } else {
                verified[location][source] = true;
            }
        })
        .catch(() => {
            verified[location][source] = false;
        });
}

// Confirms all non locally called videos that are slated to be streamed in a channel are streamable
function verifyChannel(channel) {
    if (playing[channel].playlist === 'youtube') {
        for (const playlist of playing[channel].youtubePlaylist) {
            verify('external', playlist);
        }
    }
    if (playing[channel].videoQueue.length !== 0) {
        for (const { source } of playing[channel].videoQueue) {
            verify('external', source);
        }
    }
}

// Checks if a source provided is verified, returns true/false
function verifyCheck(source, location) {
    if (source.indexOf('?v=') !== -1) {
        source = source.substring((source.indexOf('?v=') + 3)); // eslint-disable-line no-param-reassign
    }
    if (location) {
        return !!verified[location][source];
    }

    return verified.local[source] || verified.external[source];
}

// Calls for checks on all locally stored youtube sources to confirm links are good
function verifyLocal() {
    for (const x in playAssets.pass) {
        for (const y in playAssets.pass[x].playlist) {
            verify('local', playAssets.pass[x].playlist[y].link);
        }
    }
}
