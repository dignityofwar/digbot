module.exports = class TriviaCommandProcessor {
    constructor({ discordjsClient }) {
        this.client = discordjsClient;
    }

    /**
     * @param channelID
     * @param messageID
     * @param trivia
     * @return {Promise<Message>}
     */
    async processor({ data: { channelID, messageID, trivia } }) {
        const message = await this.client.channels.get(channelID).fetchMessage(messageID);

        await message.edit(this.createMessage(trivia, true));
        return true;
    }

    /**
     * Generates a RichEmbed message for Discord
     *
     * @param {object} trivia
     * @param {boolean} showAnswer
     * @return {string}
     */
    createMessage(trivia, showAnswer) {
        return {
            embed: {
                title: trivia.question,
                description: showAnswer ? trivia.answer : 'I will show the answer shortly.',
                footer: {
                    text: `${trivia.id} | ${trivia.category.title}`,
                },
            },
        };
    }
};
