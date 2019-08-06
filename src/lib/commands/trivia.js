const Command = require('./foundation/command');

const revealDuration = 30; // TODO: Should be inside the class

module.exports = class TriviaCommand extends Command {
    constructor({ apisJservice, queuesDiscordmessagequeue }) {
        super();

        this.name = 'trivia';

        this.jservice = apisJservice;
        this.queue = queuesDiscordmessagequeue;
    }

    /**
     * @param request
     * @return {Promise<void>}
     */
    async execute(request) {
        const [reply, trivia] = await Promise.all([
            request.respond('Let me fetch you a question.'),
            this.jservice.random(),
        ]);

        const content = {
            embed: {
                title: trivia.question,
                description: trivia.answer,
                footer: {
                    text: `${trivia.id} | ${trivia.category.title}`,
                },
            },
        };

        this.queue.updateMessage(content, reply.channel.id, reply.id, { delay: revealDuration * 1000 });

        content.embed.description = 'I will show the answer shortly.';

        return request.respond(content);
    }

    /**
     * @return {string}
     */
    help() {
        return `It will give you a random trivia question, and after ${revealDuration} seconds `
            + 'the answer will be revealed.';
    }
};
