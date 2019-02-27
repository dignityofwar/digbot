const Command = require('./foundation/command');

const revealDuration = 30;

module.exports = class TriviaCommand extends Command {
    constructor({ apisJservice, discordjsClient, logger, triviaCommandQueue }) { // eslint-disable-line
        super();

        this.name = 'trivia';

        this.client = discordjsClient;
        this.jservice = apisJservice;
        this.logger = logger;
        this.queue = triviaCommandQueue;

        this.queue.on('failed', (job, err) => this.logger.log('error', {
            message: err.toString(),
            label: '!trivia queue',
        }));

        this.registerEvents();

        this.queue.process(this.process.bind(this));
    }

    /**
     *
     */
    registerEvents() {
        this.client.on('disconnect', () => {
            this.queue.pause();
        });

        this.client.on('ready', () => {
            this.queue.resume();
        });
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

        this.queue.add({
            channelID: reply.channel.id,
            messageID: reply.id,
            trivia,
        }, {
            attempts: 3,
            delay: 30000,
        });

        return request.respond(this.createMessage(trivia, false));
    }

    /**
     * @param channelID
     * @param messageID
     * @param trivia
     * @return {Promise<Message>}
     */
    async process({ data: { channelID, messageID, trivia } }) {
        const message = await this.client.channels.get(channelID).fetchMessage(messageID);

        await message.edit(this.createMessage(trivia, true));
        return true;
    }

    /**
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

    /**
     * @return {string}
     */
    help() {
        return `It will give you a random trivia question, and after ${revealDuration} seconds `
            + 'the answer will be revealed.';
    }
};
