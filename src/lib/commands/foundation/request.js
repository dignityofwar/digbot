const { Message } = require('discord.js');

module.exports = class Request {
    constructor(command, message) {
        this.command = command;
        this.message = message;
    }

    /**
     * @param content
     * @param options
     * @return {Promise<Message>}
     */
    async respond(content, options) {
        if (this.response instanceof Message) {
            return this.response.edit(content, options);
        }

        this.response = await this.message.channel.send(content, options);
        return this.response;
    }

    /**
     * @param content
     * @param options
     * @return {*}
     */
    reply(content, options) {
        if (!options && typeof content === 'object' && !(content instanceof Array)) {
            options = content;
            content = '';
        } else if (!options) {
            options = {};
        }

        return this.respond(content, Object.assign(options, { reply: this.member || this.author }));
    }

    react(emoji) {
        return this.message.react(emoji);
    }

    /**
     * @return {string}
     */
    get content() {
        return this.message.cleanContent;
    }

    get member() {
        return this.message.member;
    }

    get author() {
        return this.message.author;
    }

    get guild() {
        return this.message.guild;
    }
};
