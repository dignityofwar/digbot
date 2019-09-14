const moment = require('moment');
const Dispatcher = require('../foundation/dispatcher');

const GamePresence = require('../database/gamepresence');

module.exports = class GameLoggingDispatcher extends Dispatcher {
    /**
     * @param discordjsClient
     * @param logger
     */
    constructor({ discordjsClient }) {
        super();

        this.client = discordjsClient;
    }

    /**
     * @return {Promise<void>}
     */
    async start() {
        this.registerListenersTo(this.client, {
            guildMemberAdd: member => this.filter(member)
                && setImmediate(this.started, member),
            guildMemberRemove: member => this.filter(member)
                && setImmediate(this.ended, member),
            presenceUpdate: (old, member) => this.filter(member)
                && setImmediate(this.started, member)
                && setImmediate(this.ended, old),
        });
    }

    /**
     * @return {Promise<void>}
     */
    async stop() {
        this.unregisterListenersFromAll();
    }

    /**
     * Filter members who's presences should not be recorded
     *
     * @param member
     * @return {boolean}
     */
    filter(member) {
        return !member.user.bot;
    }

    /**
     * Log when someone started playing a game
     *
     * @param member
     */
    async started(member) {
        if (member.presence.game) {
            await GamePresence.update({
                guild: member.guild.id,
                member: member.id,
                game: member.presence.game.name,
                start: member.presence.game.timestamps.start,
            }, { end: null }, { upsert: true });
        }
    }

    /**
     * Log when someone stopped playing a game
     *
     * @param member
     */
    async ended(member) {
        if (member.presence.game) {
            let now = moment();
            now = now.isAfter(member.presence.game.timestamps.start) ? now : member.presence.game.timestamps.start;

            await GamePresence.update({
                guild: member.guild.id,
                member: member.id,
                game: member.presence.game.name,
                start: member.presence.game.timestamps.start,
            }, { end: now }, { upsert: true });
        }
    }
};
