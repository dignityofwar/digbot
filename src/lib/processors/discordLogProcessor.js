const config = require('config');
const { get } = require('lodash');

module.exports = class DiscordLogProcessor {
    constructor({ discordjsClient }) {
        this.client = discordjsClient;
    }

    /**
     * Processor for the log queue
     *
     * @param info
     * @return {Promise}
     */
    async processor({ data: log }) {
        // TODO: Solution to a problem that isn't a problem? Fuck Bull with their stupid circular structure errors
        await this.channel.send(this.formatLog(log));
        return true;
    }

    /**
     * The channel that the bot should log to
     *
     * @return {TextChannel}
     */
    get channel() {
        return this.client.channels.get(config.get('channels.mappings.digBotLog'));
    }

    /**
     * Formats the message to Markdown code syntax
     *
     * @param message
     * @param level
     * @return {{embed: {color: Number, description: *}}}
     */
    formatLog({ message, level }) {
        return {
            embed: {
                description: message,
                color: this.getColor(level),
            },
        };
    }

    /**
     * Maps a level to a color in decimal notation
     *
     * @param level
     * @return {Number}
     */
    getColor(level) {
        return get({
            error: 15073280, // Red
            warn: 16763904, // Yellow
            info: 3394611, // Green
            verbose: 52479, // Light Blue
            debug: 230, // Indigo
        }, level, 808080);
    }
};
