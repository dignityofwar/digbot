const config = require('config');
const { get, intersection } = require('lodash');
const Dispatcher = require('../foundation/dispatcher');
const Request = require('../commands/foundation/request');

module.exports = class CommandDispatcher extends Dispatcher {
    /**
     * @param discordjsClient
     * @param commandRegister
     * @param logger
     * @param utilRatelimiter
     */
    constructor({ discordjsClient, commandRegister, logger, utilRatelimiter }) {// eslint-disable-line
        super();

        this.prefix = '!';

        this.client = discordjsClient;
        this.logger = logger;
        this.register = commandRegister;
        this.ratelimiter = utilRatelimiter;

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
    async handler(message) {
        // TODO: Bit of a cluster fuck, maybe split this up in multiple parts

        if (message.author.bot || message.system) { return; }

        // Handle DMs
        // if (message.channel.type === 'dm' || message.channel.type === 'group') {
        //     crashHandler.logEvent(TAG, 'directMessage');
        //     directMessage.handle(message);
        //     return;
        // }

        if (!config.get('commandChannels')
            .includes(message.channel.id)) { return; }

        if (!message.cleanContent.startsWith(this.prefix)) { return; }

        const command = this.match(message);

        if (command) {
            const request = new Request(command, message);

            if (
                command.special
                && message.member.id !== message.guild.ownerID
                && !intersection(
                    message.member.roles,
                    config.has(`guilds.${message.guild.id}.adminRoles`)
                        ? config.get(`guilds.${message.guild.id}.adminRoles`)
                        : [],
                ).length
            ) { return; }

            const throttleKey = get(command, 'throttle.peruser', true)
                ? `${command.name}:${message.guild.id}:${message.author.id}`
                : `${command.name}:${message.guild.id}`;

            if (await this.ratelimiter.tooManyAttempts(
                throttleKey,
                get(command.throttle, 'attempts', 5),
            )) {
                this.logger.log('info', {
                    message: `Command throttled: ${throttleKey}`,
                    label: 'CommandDispatcher',
                });

                if (command.throttled instanceof Function) {
                    get(command, 'throttle.peruser', true)
                        ? request.reply(command.throttled())
                        : request.respond(command.throttled());
                } else {
                    request.react('🛑');
                }

                return; // TODO: Custom message when throttled, default add a stop reaction.
            }

            await this.ratelimiter.hit(throttleKey, get(command.throttle, 'decay', 5));


            command.execute(request)
                .catch((error) => {
                    this.logger.log('error', {
                        message: error.toString(),
                        label: 'commandDispatcher',
                    });

                    request.respond('I failed you'); // TODO: Better error message
                });
        }
    }

    /**
     * @param message
     * @return {Command|undefined}
     */
    match(message) {
        const parsedName = this.sortOfParser(message.cleanContent).toUpperCase();

        return this.register.commands.find(({ name }) => name.toUpperCase() === parsedName);
    }

    /**
     * @param {string} content
     * @return {String}
     */
    sortOfParser(content) {
        return content.match(/[^\s]+/)[0].slice(1);
    }
};
