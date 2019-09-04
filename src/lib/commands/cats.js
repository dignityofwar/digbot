const { words } = require('lodash');
const Command = require('./foundation/command');

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
     * @param request
     * @return {Promise<void>}
     */
    async execute(request) {
        const img = await this.getCat(this.wantsGif(request.content));

        const response = await request.respond({ embed: { image: { url: img } } });

        return response.react('❤️');
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

    throttled() {
        return 'I\'ve decided to severely limit the amount of cats I\'m afraid.';
    }
};
