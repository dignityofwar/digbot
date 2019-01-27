const { words } = require('lodash');
const Command = require('../core/command');

module.exports = class StatsCommand extends Command {
    constructor({ apisThecatapi, utilRatelimiter }) {
        super();

        this.name = 'cats';

        this.api = apisThecatapi;
        // TODO: Should wrapped in a throttle class and only settings should be given here.
        //  The CommandDispatcher should be in charge of throttling
        this.ratelimiter = utilRatelimiter;
    }

    /**
     * @param message
     * @return {Promise<void>}
     */
    async execute(message) {
        if (this.ratelimiter.tooManyAttempts(message.guild.id, 2)) {
            return message.channel.send(
                `${message.member.displayName}, I've decided to severely limit the amount of cats I'm afraid.`,
            );
        }

        this.ratelimiter.hit(message.guild.id, 5);

        const img = await this.getCat(this.wantsGif(message.cleanContent));

        return message.channel.send({ embed: { image: { url: img } } });
    }

    /**
     * @param content
     * @return {boolean}
     */
    wantsGif(content) {
        return (words(content)[1] || '').toUpperCase() === 'GIF';
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
};
