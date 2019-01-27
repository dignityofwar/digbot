const config = require('config');
const { get } = require('lodash');
const Command = require('../core/command');
const mentionsCheck = require('../admin/antispam/mentionspam.js');

module.exports = class StatsCommand extends Command {
    constructor() {
        super();

        this.name = 'mentions';
    }

    /**
     * @param message
     * @return {Promise<void>}
     */
    async execute(message) {
        if (config.get('features.disableMentionSpam')) {
            return message.channel.send(`${message.member.displayName}, the mention limits are currently disabled. `
                + 'Please don\'t make us regret turning it off though');
        }

        // If member is exempt from limits
        if (mentionsCheck.exemptMember(message.member)) {
            return message.channel.send(`${message.member.displayName}, you are exempt from the mention limit`);
        }

        // TODO: Maybe simplify this code using lodash

        const memberMentions = config.get('memberMentionLimit')
            - get(mentionsCheck.passList(), `[${message.author.id}].memberMentions`, 0);
        const roleMentions = config.get('roleMentionLimit')
            - get(mentionsCheck.passList(), `[${message.author.id}].roleMentions`, 0);

        return message.channel.sendMessage(this.createReply(message.member.displayName, memberMentions, roleMentions));
    }

    /**
     * @param name
     * @param memberMentions
     * @param roleMentions
     * @return {string}
     */
    createReply(name, memberMentions, roleMentions) {
        let reply = `__${name}'s mention allowance__:`;

        reply += memberMentions <= 0
            ? '\nMember mentions remaining: 0, **do not attempt to mention members again this period**'
            : `\nMember mentions remaining: ${memberMentions}`;

        reply += roleMentions <= 0
            ? '\nRole mentions remaining: 0, **do not attempt to mention roles again this period**'
            : `\nRole mentions remaining: ${roleMentions}`;

        reply += '\n(*Note: mention limits reset at 4AM*)';

        return reply;
    }
};
