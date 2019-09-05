const { words } = require('lodash');
const Command = require('./foundation/command');

module.exports = class DogsCommand extends Command {
    constructor({ apisThedogapi }) {
        super();

        this.name = 'dogs';

        this.throttle = {
            attempts: 2,
            decay: 5,
        };

        this.api = apisThedogapi;
    }

    /**
     * @param request
     * @return {Promise<MessageReaction>}
     */
    async execute(request) {
        const img = await this.getCat(this.wantsGif(request.content));

        const response = await request.respond({ embed: { image: { url: img } } });

        return response.react('❤');
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
            return 'https://media1.tenor.com/images/fc9f1cfa26f9ab6fe15b6736fa13e9b3/tenor.gif';
        }
    }

    /**
     * @return {string}
     */
    help() {
        return 'Shows a random dog image from the interwebs. Append "gif" on the end to return a gif version.';
    }

    throttled() {
        return 'Too many dogs... cannot compute... try again later.';
    }
};
