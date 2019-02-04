const Command = require('../core/command');

module.exports = class TriviaCommand extends Command {
    constructor({ apisJservice, discordjsClient, logger, triviaCommandQueue }) {
        super();

        this.name = 'trivia';

        this.revealDuration = 30;

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
     * @param message
     * @return {Promise<void>}
     */
    async execute(message) {
        const [reply, trivia] = await Promise.all([
            message.channel.send('Let me fetch you a question.'),
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

        return reply.edit(this.createMessage(trivia, false));
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
        return `It will give you a random trivia question, and after ${this.revealDuration} seconds `
            + 'the answer will be revealed.';
    }
};
