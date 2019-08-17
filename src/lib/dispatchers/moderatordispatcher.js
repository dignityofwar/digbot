const Dispatcher = require('../foundation/dispatcher');

const forcedPTTCheck = require('../admin/roles/forcedpttcheck');
const mentionSpam = require('../admin/antispam/mentionspam');
const modularChannelSystem = require('../admin/channels/modularchannels');
const nameCheck = require('../welcomepack/namecheck');
const server = require('../server/server');
const welcome = require('../welcomepack/welcomepack');

// TODO: This is a temporary dispatcher

module.exports = class ModeratorDispatcher extends Dispatcher {
    /**
     * @param discordjsClient
     * @param logger
     */
    constructor({ discordjsClient, logger }) {
        super();

        this.client = discordjsClient;
        this.logger = logger;
    }

    /**
     * @return {Promise<void>}
     */
    async start() {
        this.registerListenersTo(this.client, {
            guildMemberAdd: this.guildMemberAdd.bind(this),
            guildMemberUpdate: this.guildMemberUpdate.bind(this),
            message: this.message.bind(this),
            messageUpdate: this.messsageUpdate.bind(this),
            voiceStateUpdate: this.voiceStateUpdate.bind(this),
        });
    }

    /**
     * @return {Promise<void>}
     */
    async stop() {
        this.unregisterListenersFromAll();
    }

    /**
     * @param member
     */
    guildMemberAdd(member) {
        if (welcome.check(member) && server.getChannel('general')) {
            server.getChannel('general')
                .sendMessage(`Welcome to DIG, ** ${member.displayName} **!`)
                .then(() => this.logger.log('info', {
                    message: 'Sent #general message',
                    label: 'ModeratorDispatcher',
                }))
                .catch(err => this.logger.log('warn', {
                    message: `Message failed to send ${err}`,
                    label: 'ModeratorDispatcher',
                }));
        }

        nameCheck.execute(member);
        mentionSpam.joinCheck(member);
    }

    /**
     * @param oldMember
     * @param newMember
     */
    guildMemberUpdate(oldMember, newMember) {
        nameCheck.execute(newMember);
        mentionSpam.memberUpdate(oldMember, newMember);
        forcedPTTCheck.execute(oldMember, newMember);
    }

    /**
     * @param message
     */
    message(message) {
        if (message.channel.type === 'dm' || message.channel.type === 'group') { return; }

        mentionSpam.execute(message);
    }

    /**
     * @param oldMessage
     * @param newMessage
     */
    messsageUpdate(oldMessage, newMessage) {
        if (newMessage.channel.type === 'dm' || newMessage.channel.type === 'group') { return; }

        mentionSpam.edits(oldMessage, newMessage);
    }

    /**
     * @param oldMember
     * @param newMember
     */
    voiceStateUpdate(oldMember, newMember) {
        modularChannelSystem.execute(oldMember, newMember);
    }
};
