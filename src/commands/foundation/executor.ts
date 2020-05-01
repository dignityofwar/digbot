import { inject, injectable } from 'inversify';
import CommandLexer from './lexer';
import Request from './request';
import { Channel, GuildMember, Message } from 'discord.js';
import Action from './action';
import Command from '../../models/command';
import { FilterType } from '../../models/filter';
import Throttle, { ThrottleType } from '../../models/throttle';
import RateLimiter, { RATELIMITER } from '../../utils/ratelimiter/ratelimiter';

/**
 * Executor for running commands on Discord messages
 */
@injectable()
export default class Executor {
    /**
     * @param {Map<string, Action>} repository
     * @param {RateLimiter} rateLimiter
     * @param {Throttle} defaultThrottle
     */
    public constructor(
        private readonly repository: Map<string, Action>,
        @inject(RATELIMITER) private readonly rateLimiter: RateLimiter,
        private readonly defaultThrottle: Throttle,
    ) {
    }

    /**
     * Tries to run a command if the message triggers one
     *
     * @param {Message} message
     * @return {Promise<void>} promise which return nothing when the command has been executed
     */
    public async execute(message: Message): Promise<void> {
        const lexer = new CommandLexer(message.cleanContent);
        const name = lexer.next().toLowerCase();

        const command = await Command.findOne({where: {name}});

        if (command) {

            if (!this.filterChannel(command, message.channel))
                return;

            if (!this.filterRole(command, message.member!)) {
                await message.react('🔒');
                return;
            }

            if (await this.throttled(command, message, command.throttle ?? this.defaultThrottle)) {
                const request: Request = new Request(message, lexer.remaining());

                await this.repository.get(name)!.execute(request);
            } else {
                await message.react('🛑');
            }
        }
    }

    /**
     * @param {Command} command
     * @param {Message} message
     * @param {Throttle} throttle
     * @return {Promise<boolean>}
     */
    public async throttled(command: Command, message: Message, throttle: Throttle): Promise<boolean> {
        const key = this.throttleKey(command, message, throttle);

        if (await this.rateLimiter.tooManyAttempts(key, throttle.max))
            return false;

        await this.rateLimiter.hit(key, throttle.decay);

        return true;
    }

    /**
     * @param {Command} command
     * @param {Message} message
     * @param {Throttle} throttle
     * @return {string}
     */
    public throttleKey(command: Command, message: Message, throttle: Throttle): string {
        switch (throttle.type) {
            case ThrottleType.CHANNEL:
                return `${command.name}:${message.channel.id}`;
            case ThrottleType.MEMBER:
                return `${command.name}:${message.member!.id}`;
            default:
                throw new Error(`Command uses unknown throttle type: ${throttle.type}`);
        }
    }

    /**
     * @param {Command} command
     * @param {GuildMember} member
     * @return {boolean}
     */
    public filterRole(command: Command, member: GuildMember): boolean {
        const {roleFilter} = command;
        // TODO: Should probably be a query
        return (roleFilter.type == FilterType.WHITELIST) == (roleFilter.list.snowflakes.some(({snowflake}) => member.roles.cache.has(snowflake)));
    }

    /**
     * @param {Command} command
     * @param {Channel} channel
     * @return {boolean}
     */
    public filterChannel(command: Command, channel: Channel): boolean {
        const {channelFilter} = command;
        // TODO: Should probably be a query
        return (channelFilter.type == FilterType.WHITELIST) == (channelFilter.list.snowflakes.some(({snowflake}) => snowflake == channel.id));
    }
}
