const Dispatcher = require('../core/dispatcher');

const channels = require('../admin/channels/channelsMaster');
const detectPlaying = require('../admin/roles/detectplaying');
const forcedPTTCheck = require('../admin/roles/forcedpttcheck');
const mentionSpam = require('../admin/antispam/mentionspam');
const modularChannelSystem = require('../admin/channels/modularchannels');
const nameCheck = require('../welcomepack/namecheck');
const server = require('../server/server');
const streamSpam = require('../admin/antispam/streamspam');
const welcome = require('../welcomepack/welcomepack');

module.exports = class ModeratorDispatcher extends Dispatcher {
    /**
     * @param discordjsClient
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
        this.client.on('channelCreate', this.channelCreate.bind(this));
        this.client.on('channelUpdate', this.channelUpdate.bind(this));
        this.client.on('guildMemberAdd', this.guildMemberAdd.bind(this));
        // this.client.on('guildMemberRemove', this.guildMemberRemove.bind(this));
        this.client.on('guildMemberUpdate', this.guildMemberUpdate.bind(this));
        this.client.on('messageUpdate', this.messsageUpdate.bind(this));
        this.client.on('presenceUpdate', this.presenceUpdate.bind(this));
        this.client.on('voiceStateUpdate', this.voiceStateUpdate.bind(this));
    }

    /**
     *
     * @return {Promise<void>}
     */
    async stop() {
        // TODO: Don't know if these are the correct listeners
        this.client.off('channelCreate', this.channelCreate.bind(this));
        this.client.off('channelUpdate', this.channelUpdate.bind(this));
        this.client.off('guildMemberAdd', this.guildMemberAdd.bind(this));
        // this.client.off('guildMemberRemove', this.guildMemberRemove.bind(this));
        this.client.off('guildMemberUpdate', this.guildMemberUpdate.bind(this));
        this.client.off('messageUpdate', this.messsageUpdate.bind(this));
        this.client.off('presenceUpdate', this.presenceUpdate.bind(this));
        this.client.off('voiceStateUpdate', this.voiceStateUpdate.bind(this));
    }

    /**
     * @param channel
     * @return {boolean}
     */
    channelCreate(channel) {
        if (channel.type === 'dm' || channel.type === 'group' || !channel || !channel.guild) { return; }
        channels.checkCreation(channel);
    }

    /**
     * @param oldChannel
     * @param newChannel
     */
    channelUpdate(oldChannel, newChannel) {
        if (newChannel.type === 'dm' || newChannel.type === 'group' || !newChannel || !newChannel.guild) { return; }
        channels.checkPositions(); // TODO: Should be disabled?
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
        detectPlaying.check(member);
        // presence.execute();
    }

    /**
     * @param member
     */
    // guildMemberRemove(member) {
    //     // presence.execute();
    // }

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
     * @param oldMessage
     * @param newMessage
     */
    messsageUpdate(oldMessage, newMessage) {
        // Ignore DMs
        if (newMessage.channel.type === 'dm' || newMessage.channel.type === 'group') { return; }

        streamSpam.execute(newMessage);
        mentionSpam.edits(oldMessage, newMessage);
    }

    /**
     * @param oldMember
     * @param newMember
     */
    presenceUpdate(oldMember, newMember) {
        detectPlaying.check(oldMember, newMember);
        // presence.execute();
    }

    /**
     * @param oldMember
     * @param newMember
     */
    voiceStateUpdate(oldMember, newMember) {
        modularChannelSystem.execute(oldMember, newMember);
    }
};
