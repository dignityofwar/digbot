const { words } = require('lodash');
const Command = require('../core/command');

module.exports = class CatsCommand extends Command {
    constructor({ apisThecatapi }) {
        super();

        this.name = 'cats';

        this.throttle = {
            attempts: 2,
            decay: 5,
        };

        this.api = apisThecatapi;
    }

    /**
     * @param message
     * @return {Promise<void>}
     */
    async execute(message) {
        const img = await this.getCat(this.wantsGif(message.cleanContent));

        return message.channel.send({ embed: { image: { url: img } } });
    }

    /**
     * @param content
     * @return {boolean}
     */
    wantsGif(content) {
        return (words(content).find((e, i) => i > 0 && e) || '').toUpperCase() === 'GIF';
    }

    /**
     * @param gif
     * @return {Promise<String>}
     */
    async getCat(gif) {
        try {
            return gif
                ? this.api.getGif()
                : this.api.getImg();
        } catch (e) {
            return 'http://i.imgur.com/fxorJTQ.jpg';
        }
    }

    /**
     * @return {string}
     */
    help() {
        return 'Shows a random cat image from the interwebs. Append "gif" on the end to return a gif version.';
    }
};
