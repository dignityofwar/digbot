const Command = require('../core/command');

module.exports = class StatsCommand extends Command {
    constructor({ apisJservice, discordjsClient, logger, triviaCommandQueue }) {
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
            trivia: {
                question: trivia.question,
                answer: trivia.answer,
            },
        }, {
            attempts: 3,
            delay: 30000,
        });

        return reply.edit(this.format(trivia, false));
    }

    /**
     * @param channelID
     * @param messageID
     * @param trivia
     * @return {Promise<Message>}
     */
    async process({ data: { channelID, messageID, trivia } }) {
        const message = await this.client.channels.get(channelID).fetchMessage(messageID);

        await message.edit(this.format(trivia, true));
        return true;
    }

    /**
     * @param {object} trivia
     * @param {boolean} showAnswer
     * @return {string}
     */
    format(trivia, showAnswer) {
        return '```'
            + `\n${trivia.question}`
            + `\n\n${showAnswer ? trivia.answer : 'I will show the answer shortly'}`
            + '\n```';
    }

    /**
     * @param {boolean} full
     * @return {string}
     */
    help(full) {
        return !full
            ? 'Let\'s you play some trivia'
            : 'It will give you a random trivia question, and after 3 minutes the answer will be revealed.';
    }
};
