const { get } = require('lodash');
const { RichEmbed } = require('discord.js');

const MESSAGE = Symbol.for('message');
const LEVEL = Symbol.for('level');

class DiscordRichEmbed {
    /**
     * @param opts
     */
    constructor({ opts = {} }) {
        this.defaultColor = opts.defaultColor === undefined ? opts.defaultColor : 808080;

        this.colors = {
            error: 15073281, // Red
            warn: 16763904, // Yellow
            info: 3394611, // Green
            verbose: 52479, // Light Blue
            debug: 230, // Indigo
        };

        if (opts.colors) {
            Object.assign(this.colors, opts.colors);
        }
    }

    /**
     * @param info
     * @return {*}
     */
    transform(info) {
        info[MESSAGE] = new RichEmbed()
            .setDescription(info[MESSAGE])
            .setColor(this.getColor(info[LEVEL]));

        return info;
    }

    /**
     * Maps a level to a color
     *
     * @param level
     * @return {Number}
     */
    getColor(level) {
        return get(this.colors, level, this.defaultColor);
    }
}

module.exports = opts => new DiscordRichEmbed({ opts });
