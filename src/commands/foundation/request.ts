import Command from './command';
import {
    DMChannel,
    Emoji,
    GroupDMChannel,
    Guild,
    GuildMember,
    Message,
    MessageOptions,
    MessageReaction,
    ReactionEmoji,
    RichEmbed,
    StringResolvable,
    TextChannel,
    User,
} from 'discord.js';
import { injectable } from 'inversify';

/**
 * A request object which encapsulates all info of a command that got triggered
 */
@injectable()
export default class Request {
    /**
     * The command the request triggers
     */
    public readonly command: Command;

    /**
     * The message that triggered the request
     */
    public readonly message: Message;

    public readonly argv: string[];

    /**
     * A response the bot sends to the user
     */
    private response?: Message;

    /**
     * Constructor for the Request
     *
     * @param command The command the request triggers
     * @param message The message that triggered the request
     * @param argv
     */
    public constructor(command: Command, message: Message, argv: string[]) {
        this.command = command;
        this.message = message;
        this.argv = argv;
    }

    /**
     * Responds to the users request
     *
     * @param content the message that should be send to the user
     * @param options that apply to the message
     */
    public async respond(content: StringResolvable, options?: MessageOptions | RichEmbed): Promise<Message> {
        if (this.response) {
            return this.response.edit(content, options);
        }

        const response = await this.channel.send(content, options);
        this.response = response instanceof Array ? response[0] : response;

        return this.response;
    }

    /**
     * Responds to the users request starting with a mention to the user
     *
     * @param content the message that should be send to the user
     * @param options that apply to the message
     */
    public async reply(content: StringResolvable, options?: MessageOptions | RichEmbed): Promise<Message> {
        if (!options && typeof content === 'object' && !(content instanceof Array)) {
            options = content;
            content = '';
        } else if (!options) {
            options = {};
        }

        return this.respond(content, Object.assign(options, {reply: this.member || this.author}));
    }

    /**
     * Send a reaction to the user message in emoji form
     *
     * @param emoji the reaction
     */
    public async react(emoji: string | Emoji | ReactionEmoji): Promise<MessageReaction> {
        return await this.message.react(emoji);
    }

    /**
     * The content of the request send by the user
     */
    public get content(): string {
        return this.message.cleanContent;
    }

    /**
     * The guild member who send the request
     */
    public get member(): GuildMember {
        return this.message.member;
    }

    /**
     * The user who send the request
     */
    public get author(): User {
        return this.message.author;
    }

    /**
     * The guild associated with the request
     */
    public get guild(): Guild {
        return this.message.guild;
    }

    /**
     * The channel associated with the request
     */
    public get channel(): TextChannel | GroupDMChannel | DMChannel {
        return this.message.channel;
    }
}
