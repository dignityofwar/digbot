import {
    APIMessage,
    DMChannel,
    EmojiIdentifierResolvable,
    Guild,
    GuildMember,
    Message,
    MessageAdditions,
    MessageOptions,
    MessageReaction,
    StringResolvable,
    TextChannel,
    User,
} from 'discord.js';

/**
 * A request object which encapsulates all info of a command that got triggered
 *
 * TODO: Message caching disabled, due too send and edit accepting different options types
 */
export default class Request {
    /**
     * A response the bot sends to the user (DISABLED)
     */

    // private response?: Message;

    /**
     * Constructor for the Request
     *
     * @param {Message} message The message that triggered the request
     * @param {string[]} argv The arguments specified in the message
     */
    public constructor(
        private readonly message: Message,
        private readonly argv: string[],
    ) {
    }

    /**
     * Responds to the users request
     *
     * @param {StringResolvable} content The message that should be send to the user
     * @param {MessageOptions | MessageAdditions} options that apply to the message
     * @return {Promise<Message>} A promise which returns the message send
     */
    public async respond(content: StringResolvable | APIMessage, options?: MessageOptions | MessageAdditions): Promise<Message> {
        return this.channel.send(content, options);
    }

    /**
     * Responds to the users request starting with a mention to the user
     *
     * @param {StringResolvable | APIMessage} content The message that should be send to the user
     * @param {MessageOptions | MessageAdditions} options that apply to the message
     * @return {Promise<Message>} A promise which returns the message send
     */
    public async reply(content: StringResolvable | APIMessage, options?: MessageOptions | MessageAdditions): Promise<Message> {
        return this.message.reply(content, options);
    }

    /**
     *
     *
     * @param emoji
     */
    /**
     * Send a reaction to the user message in emoji form
     *
     * @param {EmojiIdentifierResolvable} emoji The reaction
     * @return {Promise<MessageReaction>} A promise which returns the reaction send
     */
    public async react(emoji: EmojiIdentifierResolvable): Promise<MessageReaction> {
        return await this.message.react(emoji);
    }

    /**
     * The content of the request send by the user
     *
     * @return {string} the content of the message
     */
    public get content(): string {
        return this.message.cleanContent;
    }

    /**
     * The guild member who send the request
     *
     * @return {GuildMember} the member
     */
    public get member(): GuildMember | null {
        return this.message.member;
    }

    /**
     * The user who send the request
     *
     * @return {User} the user
     */
    public get author(): User {
        return this.message.author;
    }

    /**
     * The guild associated with the request
     *
     * @return {Guild} the guild
     */
    public get guild(): Guild | null {
        return this.message.guild;
    }

    /**
     * The channel associated with the request
     *
     * @return {TextChannel | DMChannel} the channel
     */
    public get channel(): TextChannel | DMChannel {
        return this.message.channel;
    }
}
