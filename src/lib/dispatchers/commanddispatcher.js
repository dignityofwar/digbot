const config = require('config');
const { words } = require('lodash');
const Dispatcher = require('../core/dispatcher');

module.exports = class CommandDispatcher extends Dispatcher {
    /**
     * @param discordjsClient
     * @param commandRegister
     * @param logger
     */
    constructor({ discordjsClient, commandRegister, logger }) {
        super();

        this.prefix = '!';

        this.client = discordjsClient;
        this.logger = logger;
        this.register = commandRegister;

        this.listener = this.handler.bind(this);
    }

    /**
     *
     * @return {Promise<void>}
     */
    async start() {
        this.client.on('message', this.listener);
    }

    /**
     *
     * @return {Promise<void>}
     */
    async stop() {
        this.client.off('message', this.listener);
    }

    /**
     *
     * @param message
     */
    handler(message) {
        if (message.author.bot || message.system) { return; }

        // Handle DMs
        // if (message.channel.type === 'dm' || message.channel.type === 'group') {
        //     crashHandler.logEvent(TAG, 'directMessage');
        //     directMessage.handle(message);
        //     return;
        // }

        if (config.get('commandChannels')
            .includes(message.channel.id)) { return; }

        if (!message.cleanContent.startsWith(this.prefix)) { return; }

        const command = this.match(message);

        if (command) {
            // TODO: Maybe better error handling, like sending a message that the command failed
            //  Note that it should take into account messages that are already send and if it is connected
            //  If it has already send a message it should overwrite that message
            //  If it lost the connection to discord, push the command with it's state to a queue
            //  This will probably requires a wrapper for the message which will be passed to the command, also the
            //  commands need to be split up in stages when necessary so it can resume execution
            command.execute(message)
                .catch(error => this.logger.log('error', {
                    message: error.toString(),
                    label: 'commandDispatcher',
                }));
        }
    }

    /**
     * @param message
     * @return {never}
     */
    match(message) {
        const parsedName = this.sortOfParser(message.cleanContent)
            .toUpperCase();

        return this.register.commands.find(({ name }) => name.toUpperCase() === parsedName);
    }

    /**
     * @param {string} content
     * @return {String}
     */
    sortOfParser(content) {
        return words(content)[0].slice(0);
    }
};
