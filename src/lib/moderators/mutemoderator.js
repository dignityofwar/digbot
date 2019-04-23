const EventEmitter = require('events');
const config = require('config');
const moment = require('moment');

const MAX_ATTEMPTS = 10;
const BASE_MUTE_DUR = 15;

module.exports = class MuteModerator extends EventEmitter {
    /**
     * @param ratelimiter
     * @param redisClient
     * @param muteModeratorQueue
     */
    constructor({ utilRatelimiter, redisClient, muteModeratorQueue }) {
        super();

        this.queue = muteModeratorQueue;
        this.ratelimiter = utilRatelimiter;
        this.redis = redisClient;
    }

    /**
     * @param guildMember
     * @param weight
     * @return {Promise<void>}
     */
    async hitMember(guildMember, weight = 1) {
        if (!config.has(`guilds.${guildMember.guild.id}.supermuteRole`)) {
            return;
        }

        const key = this.generateKey(guildMember);

        if (this.ratelimiter.tooManyAttempts(key, MAX_ATTEMPTS)) {
            this.commitedOffence(guildMember);
        } else {
            const hits = await this.ratelimiter.hit(key, 180, weight);

            if (hits <= MAX_ATTEMPTS) {
                this.emit('memberHitLimit', guildMember);
            }
        }
    }

    /**
     * @param guildMember
     * @return {string}
     */
    generateKey(guildMember) {
        return `mutemoderator:${guildMember.guild.id}:${guildMember.user.id}`;
    }

    /**
     * @param guildMember
     */
    async muteGuildMember(guildMember) {
        // TODO: Add reason for better loging
        await guildMember.addRole(config.get(`guilds.${guildMember.guild.id}.supermuteRole`));
    }

    async unmuteGuildMember(guildMember) {
        await guildMember.removeRole(config.get(`guilds.${guildMember.guild.id}.supermuteRole`));

        await (await this.queue.getJob(`${guildMember.guild.id}:${guildMember.user.id}`)).moveToCompleted();
    }

    async commitedOffence(guildMember) {
        await this.muteGuildMember(guildMember);

        const offenceNo = await this.registerOffence(guildMember);

        this.queue.add({
            guild: guildMember.guild.id,
            user: guildMember.user.id,
        }, {
            delay: (2 ** (offenceNo - 1)) * BASE_MUTE_DUR * 60000,
            jobId: `${guildMember.guild.id}:${guildMember.user.id}`,
        });
    }

    /**
     * Registers an offence. All offences will be dropped at the end of the day.
     *
     * @param guildMember
     * @return {Promise<number>}
     */
    async registerOffence(guildMember) {
        const key = `mutemoderator:${guildMember.guild.id}:${guildMember.user.id}`;

        const offences = await this.offenceNo(guildMember);

        const pipeline = this.redis.pipeline().incr(key);

        if (!offences) {
            pipeline.expireat(key, moment().endOf('day').unix());
        }

        return pipeline.exec().then(([[, o]]) => o);
    }

    /**
     * Gives the number of offences of a guild member.
     *
     * @param guildMember
     * @return {Promise<number>}
     */
    async offenceNo(guildMember) {
        const key = `mutemoderator:${guildMember.guild.id}:${guildMember.user.id}`;

        return (await this.redis.get(key)) || 0;
    }

    async schouldBeMuted(guildMember) {
        return (await this.queue.getJob(`${guildMember.guild.id}:${guildMember.user.id}`) != null);
    }

    // async resetOffences(guildMember) {
    //
    // }
};
