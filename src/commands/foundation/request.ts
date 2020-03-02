import {
    DMChannel,
    EmojiResolvable,
    Guild,
    GuildMember,
    Message, MessageEditOptions,
    MessageEmbed,
    MessageOptions,
    MessageReaction,
    StringResolvable,
    TextChannel,
    User,
} from 'discord.js';

/**
 * A request object which encapsulates all info of a command that got triggered
 */
export default class Request {
    /**
     * The message that triggered the request
     */
    public readonly message: Message;

    /**
     * The arguments given in the message
     */
    public readonly argv: string[];

    /**
     * A response the bot sends to the user
     */
    private response?: Message;

    /**
     * Constructor for the Request
     *
     * @param {Message} message The message that triggered the request
     * @param {string[]} argv The arguments specified in the message
     */
    public constructor(message: Message, argv: string[]) {
        this.message = message;
        this.argv = argv;
    }

    /**
     * Responds to the users request
     *
     * @param {StringResolvable} content The message that should be send to the user
     * @param {MessageOptions | RichEmbed} options that apply to the message
     * @return {Promise<Message>} A promise which returns the message send
     */
    public async respond(content: StringResolvable, options?: MessageEditOptions | MessageEmbed): Promise<Message> {
        if (this.response) {
            return this.response.edit(content, options);
        }

        const response = await this.channel.send(content);
        this.response = response instanceof Message ? response : response[0];

        return this.response;
    }

    /**
     * Responds to the users request starting with a mention to the user
     *
     * @param {StringResolvable} content The message that should be send to the user
     * @param {MessageOptions | MessageEmbed} options that apply to the message
     * @return {Promise<Message>} A promise which returns the message send
     */
    public async reply(content: StringResolvable, options?: MessageOptions | MessageEmbed): Promise<Message> {
        if (!options && typeof content === 'object' && !(content instanceof Array)) {
            options = content;
            content = '';
        } else if (!options) {
            options = {};
        }

        return this.respond(content);//, Object.assign(options, {reply: this.member ?? this.author}));
    }

    /**
     *
     *
     * @param emoji
     */
    /**
     * Send a reaction to the user message in emoji form
     *
     * @param {EmojiResolvable} emoji The reaction
     * @return {Promise<MessageReaction>} A promise which returns the reaction send
     */
    public async react(emoji: EmojiResolvable): Promise<MessageReaction> {
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
