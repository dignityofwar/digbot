const Command = require('./foundation/command');

module.exports = class AdminCommand extends Command {
    constructor({ commandRegister }) {
        super();

        this.name = 'admin';
        this.special = true;

        this.register = commandRegister;
    }

    /**
     * @param request
     * @return {Promise<void>}
     */
    async execute(request) {
        return Promise.all([
            request.member.send(this.createReply()),
            request.respond(`I'll PM you the list of admin commands ${request.member.displayName}`),
        ]);
    }

    /**
     * @return {string}
     */
    /**
     * @return {string}
     */
    createReply() {
        return {
            embed: {
                title: 'Admin Commands',
                fields: [
                    ...this.register.toArray()
                        .filter(({ special }) => special)
                        .map(({ name, help }) => ({
                            name: `!${name}`,
                            value: help(),
                        })),
                ],
            },
        };
    }

    /**
     * @return {string}
     */
    help() {
        return 'Lists all admin commands';
    }
};
