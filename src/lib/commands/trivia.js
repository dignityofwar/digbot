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
     * @return {string}
     */
    help() {
        return `It will give you a random trivia question, and after ${revealDuration} seconds `
            + 'the answer will be revealed.';
    }
};
