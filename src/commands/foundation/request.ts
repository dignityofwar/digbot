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

@injectable()
export default class Request {
    public readonly command: Command;
    public readonly message: Message;

    private response?: Message;

    constructor(command: Command, message: Message) {
        this.command = command;
        this.message = message;
    }

    public async respond(content: StringResolvable, options?: MessageOptions | RichEmbed): Promise<Message> {
        if (this.response) {
            return this.response.edit(content, options);
        }

        const response = await this.channel.send(content, options);
        this.response = response instanceof Array ? response[0] : response;

        return this.response;
    }

    public async reply(content: StringResolvable, options?: MessageOptions | RichEmbed): Promise<Message> {
        if (!options && typeof content === 'object' && !(content instanceof Array)) {
            options = content;
            content = '';
        } else if (!options) {
            options = {};
        }

        return this.respond(content, Object.assign(options, {reply: this.member || this.author}));
    }

    public async react(emoji: string | Emoji | ReactionEmoji): Promise<MessageReaction> {
        return await this.message.react(emoji);
    }

    public get content(): string {
        return this.message.cleanContent;
    }

    public get member(): GuildMember {
        return this.message.member;
    }

    public get author(): User {
        return this.message.author;
    }

    public get guild(): Guild {
        return this.message.guild;
    }

    public get channel(): TextChannel | GroupDMChannel | DMChannel {
        return this.message.channel;
    }
}
