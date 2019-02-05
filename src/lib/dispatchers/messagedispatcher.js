const Dispatcher = require('../core/dispatcher');
// const admin = require('../admin/admin.js');
// const commands = require('../commands/commands.js');
const directMessage = require('../discord/direct-message.js');
const crashHandler = require('../crash-handling.js');

// TODO: This is a temporary dispatcher
//  DO NOT USE, MARKED FOR DELETION!! ONLY HERE FOR REFERENCE!!

module.exports = class MessageDispatcher extends Dispatcher {
    /**
     *
     * @param discordjsClient
     */
    constructor({ discordjsClient }) {
        super();

        this.client = discordjsClient;

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
        setImmediate(() => { // eslint-disable-line consistent-return
            const prefix = '!';

            if (message.author.bot) { return false; } // Ignore if a bot
            crashHandler.logMessage(message);

            // Handle DMs
            if (message.channel.type === 'dm' || message.channel.type === 'group') {
                crashHandler.logEvent('MessageDispatcher', 'directMessage');
                directMessage.handle(message);
                return false;
            }

            // Check if the command originated from whitelisted channels
            if (!admin.commandChannel(message)) { return false; }

            // Run admin checks. Stop if the message is invalid.
            if (!admin.check(message)) { return false; }

            // Ignore if no prefix
            if (!message.content.startsWith(prefix)) { return false; }

            // Ignore if not command
            if (!commands.check(message.content)) { return false; }

            // Calls antispam function from antispam.js to prevent people spamming the bot
            if (!admin.antispamCheck(message)) { return false; }

            /* BROKEN STILL. SEE #50.
            message.channel.startTyping(message.channel);

            // Set a timeout after 5 seconds in case it doesn't get sent for some reason
            typetimeout = setTimeout(function() {
                message.channel.stopTyping();
                logger.warning(TAG, 'stopTyping timeout executed...');
            }, 5000);
            */

            // Send command to command module for processing
            commands.proxy(message); // Pass the command to the commands.js proxy to be executed.
        });
    }
};
